import { validationResult } from "express-validator";
import { listPublicProducts, getPublicProductBySlug } from "../../services/public/publicProduct.service.js";
import { listPublicCategories, listPublicBanners } from "../../services/public/publicCatalog.service.js";

function sendValidationError(res, req) {
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

export function listProducts(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => listPublicProducts(req.query), "Lấy danh sách sản phẩm thành công");
}

export function getProduct(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => getPublicProductBySlug(req.params.slug), "Lấy chi tiết sản phẩm thành công");
}

export function listCategories(req, res, next) {
  return run(res, next, () => listPublicCategories(), "Lấy danh sách danh mục thành công");
}

export function listBanners(req, res, next) {
  return run(res, next, () => listPublicBanners(), "Lấy danh sách banner thành công");
}
