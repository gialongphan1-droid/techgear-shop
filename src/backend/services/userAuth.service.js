import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const dummyPasswordHash = bcrypt.hashSync("dummy-password-123", 12);

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

export async function getUserSession(userId) {
  const user = await User.findById(userId).select("fullName email isVerified").lean();
  if (!user || !user.isVerified) {
    throw serviceError(401, "Phiên đăng nhập không hợp lệ");
  }
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    isVerified: user.isVerified,
  };
}

export async function registerUser({ fullName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw serviceError(409, "Email đã được đăng ký");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  let user;
  try {
    user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      isVerified: false,
      verificationToken: hashToken(verificationToken),
      verificationTokenExpires: new Date(Date.now() + VERIFICATION_TTL_MS),
    });
  } catch (error) {
    if (error?.code === 11000) throw serviceError(409, "Email đã được đăng ký");
    throw error;
  }

  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  return { id: user._id.toString(), fullName: user.fullName, email: user.email };
}

export async function verifyUserEmail(token) {
  const user = await User.findOneAndUpdate(
    {
      verificationToken: hashToken(token),
      verificationTokenExpires: { $gt: new Date() },
      isVerified: false,
    },
    {
      $set: { isVerified: true },
      $unset: { verificationToken: 1, verificationTokenExpires: 1 },
    },
    { new: true, runValidators: true },
  ).select("fullName email isVerified");

  if (!user) throw serviceError(400, "Liên kết xác thực không hợp lệ hoặc đã hết hạn");
  return { id: user._id.toString(), fullName: user.fullName, email: user.email };
}

export async function authenticateUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  const passwordMatches = await bcrypt.compare(password, user?.password || dummyPasswordHash);
  if (!user || !passwordMatches) {
    throw serviceError(401, "Email hoặc mật khẩu không đúng");
  }
  if (!user.isVerified) {
    throw serviceError(403, "Vui lòng xác thực email trước khi đăng nhập");
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: "customer" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h", issuer: "techgear-shop" },
  );
  return {
    token,
    user: { id: user._id.toString(), fullName: user.fullName, email: user.email },
  };
}
