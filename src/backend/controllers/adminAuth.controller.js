import { validationResult } from "express-validator";
import { createCsrfToken } from "../middleware/csrf.middleware.js";
import {
  authenticateAdmin,
  getAdminSession,
  logoutAdminSession,
} from "../services/adminAuth.service.js";

function success(res, status, message, data = {}) {
  return res.status(status).json({ success: true, message, data, errors: [] });
}

function failure(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, data: {}, errors });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
    sameSite: process.env.COOKIE_SAMESITE || "strict",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  };
}

export async function loginAdmin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return failure(res, 422, "Dữ liệu đăng nhập không hợp lệ", errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })));
    }

    const result = await authenticateAdmin(req.body.email, req.body.password);
    if (!result) {
      return failure(res, 401, "Email hoặc mật khẩu không đúng");
    }

    res.cookie(process.env.ADMIN_COOKIE_NAME || "admin_token", result.token, cookieOptions());
    const csrfToken = createCsrfToken();
    res.cookie(process.env.CSRF_COOKIE_NAME || "csrf_token", csrfToken, {
      httpOnly: false,
      secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
      sameSite: process.env.COOKIE_SAMESITE || "strict",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });
    return success(res, 200, "Đăng nhập thành công", { admin: result.admin, csrfToken });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentAdmin(req, res, next) {
  try {
    const admin = await getAdminSession(req.admin.id);
    if (!admin) return failure(res, 401, "Phiên đăng nhập không hợp lệ");
    return success(res, 200, "Phiên đăng nhập hợp lệ", { admin });
  } catch (error) {
    return next(error);
  }
}

export async function logoutAdmin(req, res, next) {
  try {
    await logoutAdminSession(req.admin.id);
    res.clearCookie(process.env.ADMIN_COOKIE_NAME || "admin_token", {
      httpOnly: true,
      secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
      sameSite: process.env.COOKIE_SAMESITE || "strict",
      path: "/",
    });
    res.clearCookie(process.env.CSRF_COOKIE_NAME || "csrf_token", {
      httpOnly: false,
      secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
      sameSite: process.env.COOKIE_SAMESITE || "strict",
      path: "/",
    });
    return success(res, 200, "Đăng xuất thành công");
  } catch (error) {
    return next(error);
  }
}
