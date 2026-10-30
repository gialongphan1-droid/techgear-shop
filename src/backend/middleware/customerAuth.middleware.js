import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export async function requireCustomerAuth(req, res, next) {
  const unauthorized = () => res.status(401).json({
    success: false,
    message: "Vui lòng đăng nhập để tiếp tục",
    data: {},
    errors: [],
  });

  const token = req.cookies?.[process.env.USER_COOKIE_NAME || "user_token"];
  if (!token) return unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: "techgear-shop" });
  } catch {
    return unauthorized();
  }

  if (payload.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Tài khoản không có quyền truy cập",
      data: {},
      errors: [],
    });
  }
  if (typeof payload.id !== "string" || !mongoose.isObjectIdOrHexString(payload.id)) {
    return unauthorized();
  }

  try {
    const user = await User.findById(payload.id).select("isVerified");
    if (!user) return unauthorized();
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản chưa xác thực email",
        data: {},
        errors: [],
      });
    }

    req.user = { id: user._id.toString(), role: payload.role };
    return next();
  } catch (error) {
    return next(error);
  }
}
