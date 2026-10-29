import { validationResult } from "express-validator";
import {
  getAdminOrderDetail,
  listAdminOrders,
  updateAdminOrderStatus,
} from "../services/adminOrder.service.js";

function sendValidationError(res, req) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return null;
  return res.status(422).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    data: {},
    errors: errors.array().map((error) => ({ field: error.path, message: error.msg })),
  });
}

async function run(res, next, operation, successMessage) {
  try {
    const data = await operation();
    return res.status(200).json({
      success: true,
      message: successMessage,
      data,
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}

export function listOrdersAdmin(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(
    res,
    next,
    () => listAdminOrders(req.query),
    "Lấy danh sách đơn hàng thành công",
  );
}

export function getOrderAdmin(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(
    res,
    next,
    () => getAdminOrderDetail(req.params.id),
    "Lấy chi tiết đơn hàng thành công",
  );
}

export function updateOrderStatusAdmin(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(
    res,
    next,
    () => updateAdminOrderStatus(req.params.id, req.body, req.admin),
    "Cập nhật trạng thái đơn hàng thành công",
  );
}
