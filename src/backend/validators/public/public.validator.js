import { param, query } from "express-validator";

export const validatePublicProductList = [
  query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("page phải là số nguyên từ 1 đến 100000").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải là số nguyên từ 1 đến 100").toInt(),
  query("category").optional().isString().isLength({ min: 1, max: 100 }).trim(),
  query("brand").optional().isString().isLength({ min: 1, max: 100 }).trim(),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice phải lớn hơn hoặc bằng 0").toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice phải lớn hơn hoặc bằng 0").toFloat(),
  query("search").optional().isString().isLength({ max: 100 }).trim(),
  query("sort").optional().isString().isIn(["newest", "oldest", "createdAt", "priceAsc", "priceDesc", "price_asc", "price_desc", "popular"]).withMessage("sort không hợp lệ"),
  query("maxPrice").optional().custom((value, { req }) => req.query.minPrice === undefined || Number(value) >= Number(req.query.minPrice)).withMessage("maxPrice phải lớn hơn hoặc bằng minPrice"),
];

export const validatePublicProductSlug = [
  param("slug").isString().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i).withMessage("Slug sản phẩm không hợp lệ").isLength({ max: 150 }),
];
