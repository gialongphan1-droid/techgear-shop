import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function requireAdmin(req, res, next) {
  try {
    const cookieName = process.env.ADMIN_COOKIE_NAME || "admin_token";
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ", data: {}, errors: [] });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: "techgear-shop" });
    } catch {
      return res.status(401).json({ success: false, message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ", data: {}, errors: [] });
    }

    const admin = await Admin.findById(payload.id).select("name email tokenVersion");
    if (!admin || admin.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ", data: {}, errors: [] });
    }

    req.admin = { id: admin._id.toString(), name: admin.name, email: admin.email };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ", data: {}, errors: [] });
  }
}
