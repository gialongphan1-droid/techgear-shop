import { validationResult } from "express-validator";
import * as orderService from "../../services/orders/order.service.js";

function validationError(res, req, message = "Dữ liệu không hợp lệ") {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(422).json({
    success: false,
    message,
    data: {},
    errors: result.array().map((error) => ({ field: error.path, message: error.msg })),
  });
}

export async function createOrder(req, res, next) {
  const validation = validationError(res, req);
  if (validation) return validation;

  try {
    const result = await orderService.createOrder(req, res, req.body);
    if (result.cartCleared) {
      res.clearCookie(process.env.CART_COOKIE_NAME || "techgear_cart", {
        httpOnly: true,
        secure: String(process.env.COOKIE_SECURE).toLowerCase() === "true",
        sameSite: process.env.COOKIE_SAMESITE || "strict",
        path: "/",
      });
    }

    return res.status(result.isIdempotent ? 200 : 201).json({
      success: true,
      message: result.isIdempotent ? "Đơn hàng đã được tạo trước đó" : "Tạo đơn hàng thành công",
      data: result.trackCode
        ? { order: result.order, trackCode: result.trackCode }
        : { order: result.order, isIdempotent: true },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}

export async function trackOrder(req, res, next) {
  const validation = validationError(res, req, "Mã không hợp lệ");
  if (validation) return validation;

  try {
    const order = await orderService.trackOrder(req.body);
    return res.status(200).json({
      success: true,
      message: "Tra cứu đơn hàng thành công",
      data: { order },
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}
