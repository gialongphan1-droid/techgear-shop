import crypto from "crypto";

export function createCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function requireCsrf(req, res, next) {
  const cookieName = process.env.CSRF_COOKIE_NAME || "csrf_token";
  const cookieToken = req.cookies?.[cookieName];
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token không hợp lệ hoặc bị thiếu",
      data: {},
      errors: [],
    });
  }

  return next();
}
