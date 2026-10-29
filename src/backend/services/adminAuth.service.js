import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const dummyPasswordHash = bcrypt.hashSync("dummy-password-123", 12);

export async function authenticateAdmin(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail }).select("+password");
  const passwordHash = admin?.password || dummyPasswordHash;
  const isValidPassword = await bcrypt.compare(password, passwordHash);

  if (!admin || !isValidPassword) return null;

  await Admin.updateOne({ _id: admin._id }, { $set: { lastLogin: new Date() } });

  const token = jwt.sign(
    { id: admin._id.toString(), tokenVersion: admin.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h", issuer: "techgear-shop" },
  );

  return {
    token,
    admin: { id: admin._id.toString(), name: admin.name, email: admin.email },
  };
}

export async function getAdminSession(adminId) {
  const admin = await Admin.findById(adminId).select("name email tokenVersion lastLogin");
  if (!admin) return null;
  return { id: admin._id.toString(), name: admin.name, email: admin.email };
}

export async function logoutAdminSession(adminId) {
  await Admin.updateOne({ _id: adminId }, { $inc: { tokenVersion: 1 } });
}
