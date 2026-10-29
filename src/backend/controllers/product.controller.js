import { validationResult } from "express-validator";
import {
  createProductAdmin,
  deleteProductAdmin,
  getProductAdmin,
  listProductsAdmin,
  updateProductAdmin,
  updateProductStatusAdmin,
} from "../services/product.service.js";

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

async function run(res, next, operation, successMessage, successStatus = 200) {
  try {
    const data = await operation();
    return res.status(successStatus).json({ success: true, message: successMessage, data, errors: [] });
  } catch (error) {
    return next(error);
  }
}

export function listProducts(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => listProductsAdmin(req.query), "Lấy danh sách sản phẩm thành công");
}

export function getProduct(req, res, next) {
  return run(res, next, () => getProductAdmin(req.params.id), "Lấy sản phẩm thành công");
}

export function createProduct(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => createProductAdmin(req.body), "Tạo sản phẩm thành công", 201);
}

export function updateProduct(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => updateProductAdmin(req.params.id, req.body), "Cập nhật sản phẩm thành công");
}

export function updateProductStatus(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => updateProductStatusAdmin(req.params.id, req.body.status), "Cập nhật trạng thái sản phẩm thành công");
}

export function deleteProduct(req, res, next) {
  return run(res, next, () => deleteProductAdmin(req.params.id), "Xử lý xóa sản phẩm thành công");
}
