import { validationResult } from "express-validator";
import { createCsrfToken } from "../middleware/csrf.middleware.js";
import { getUserSession } from "../services/userAuth.service.js";
import {
  authenticateUser,
  registerUser,
  verifyUserEmail,
} from "../services/userAuth.service.js";

function failure(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, data: {}, errors });
}

function validationFailure(res, req, status = 422, message = "Dữ liệu không hợp lệ") {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return failure(
    res,
    status,
    message,
    result.array().map((error) => ({ field: error.path, message: error.msg })),
  );
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

export async function getCurrentUser(req, res, next) {
  try {
    const user = await getUserSession(req.user.id);
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin khách hàng thành công",
      data: { user },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}

export async function register(req, res, next) {
  const validation = validationFailure(res, req);
  if (validation) return validation;

  try {
    const user = await registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
      data: { user },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyEmail(req, res, next) {
  const validation = validationFailure(
    res,
    req,
    400,
    "Liên kết xác thực không hợp lệ hoặc đã hết hạn",
  );
  if (validation) return validation;

  try {
    const user = await verifyUserEmail(req.query.token);
    return res.status(200).json({
      success: true,
      message: "Xác thực email thành công",
      data: { user },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  const validation = validationFailure(res, req);
  if (validation) return validation;

  try {
    const result = await authenticateUser(req.body.email, req.body.password);
    res.cookie(process.env.USER_COOKIE_NAME || "user_token", result.token, cookieOptions());

    const csrfToken = createCsrfToken();
    res.cookie(process.env.CSRF_COOKIE_NAME || "csrf_token", csrfToken, {
      httpOnly: false,
      secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
      sameSite: process.env.COOKIE_SAMESITE || "strict",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: { user: result.user, csrfToken },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}
