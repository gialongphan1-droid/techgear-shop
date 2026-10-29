import { validationResult } from "express-validator";
import { createCsrfToken } from "../../middleware/csrf.middleware.js";
import * as cartService from "../../services/cart/cart.service.js";

function validationError(res, req) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(422).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    data: {},
    errors: result.array().map((error) => ({ field: error.path, message: error.msg })),
  });
}

async function run(res, next, operation, message) {
  try {
    const data = await operation();
    return res.status(200).json({ success: true, message, data, errors: [] });
  } catch (error) {
    return next(error);
  }
}

export function getCart(req, res, next) {
  const csrfToken = createCsrfToken();
  res.cookie(process.env.CSRF_COOKIE_NAME || "csrf_token", csrfToken, {
    httpOnly: false,
    secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
    sameSite: process.env.COOKIE_SAMESITE || "strict",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
  });
  return run(res, next, async () => {
    const data = await cartService.getCart(req);
    return { ...data, csrfToken };
  }, "Lấy giỏ hàng thành công");
}

export function addCartItem(req, res, next) {
  const validation = validationError(res, req);
  if (validation) return validation;
  return run(res, next, () => cartService.addCartItem(req, res, req.body), "Thêm sản phẩm vào giỏ hàng thành công");
}

export function updateCartItem(req, res, next) {
  const validation = validationError(res, req);
  if (validation) return validation;
  return run(res, next, () => cartService.updateCartItem(req, req.body, req.params.productId), "Cập nhật giỏ hàng thành công");
}

export function deleteCartItem(req, res, next) {
  const validation = validationError(res, req);
  if (validation) return validation;
  return run(res, next, () => cartService.deleteCartItem(req, req.params.productId), "Xóa sản phẩm khỏi giỏ hàng thành công");
}

export function clearCart(req, res, next) {
  return run(res, next, () => cartService.clearCart(req), "Đã xóa toàn bộ giỏ hàng");
}
