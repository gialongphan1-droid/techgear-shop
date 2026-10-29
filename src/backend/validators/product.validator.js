import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const statuses = ["ACTIVE", "PAUSED", "INACTIVE"];

export const validateProductId = [
  param("id").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("ID sản phẩm không hợp lệ"),
];

export const validateListProducts = [
  query("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên dương").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100").toInt(),
  query("search").optional().isString().isLength({ max: 100 }).trim(),
  query("category").optional().custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("category không hợp lệ"),
  query("status").optional().isIn(statuses).withMessage("status không hợp lệ"),
];

const commonFields = [
  body("name").optional().isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/).withMessage("Tên phải từ 2-100 ký tự và không chứa HTML"),
  body("slug").optional().isString().trim().isLength({ min: 1, max: 150 }).matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i).withMessage("Slug không hợp lệ"),
  body("categoryId").optional().custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("categoryId không hợp lệ"),
  body("brand").optional().isString().trim().isLength({ min: 1, max: 100 }).matches(/^[^<>]*$/).withMessage("Brand không hợp lệ"),
  body("listPrice").optional().isFloat({ min: 0 }).withMessage("listPrice phải là số lớn hơn hoặc bằng 0").toFloat(),
  body("salePrice").optional({ nullable: true }).isFloat({ min: 0 }).withMessage("salePrice phải là số lớn hơn hoặc bằng 0").toFloat(),
  body("status").optional().isIn(statuses).withMessage("status không hợp lệ"),
  body("images").optional().isArray({ min: 1 }).withMessage("images phải là mảng có ít nhất một phần tử"),
  body("images.*.url").optional().isURL({ protocols: ["http", "https"] }).withMessage("URL ảnh không hợp lệ"),
  body("images.*.publicId").optional().isString().trim().isLength({ min: 1, max: 255 }),
  body("images.*.isPrimary").optional().isBoolean().withMessage("isPrimary phải là boolean").toBoolean(),
  body("specs").optional().isArray(),
  body("specs.*.key").optional().isString().isLength({ max: 100 }),
  body("specs.*.name").optional().isString().isLength({ max: 100 }),
  body("specs.*.value").optional().isString().isLength({ max: 500 }),
  body("specs.*.unit").optional().isString().isLength({ max: 50 }),
  body("warranty").optional().isString().trim().isLength({ max: 200 }),
  body("seo.title").optional().isString().isLength({ max: 200 }),
  body("seo.description").optional().isString().isLength({ max: 500 }),
  body("seo.keywords").optional().isArray(),
];

export const validateCreateProduct = [
  ...commonFields,
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => {
    const allowed = new Set(["name", "slug", "categoryId", "brand", "listPrice", "salePrice", "stock", "status", "images", "specs", "warranty", "seo"]);
    return Object.keys(value || {}).every((key) => allowed.has(key));
  }).withMessage("Chứa trường không được phép"),
  body("name").exists().withMessage("name là bắt buộc").isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/),
  body("categoryId").exists().withMessage("categoryId là bắt buộc").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("categoryId không hợp lệ"),
  body("brand").exists().withMessage("brand là bắt buộc").isString().trim().isLength({ min: 1, max: 100 }).matches(/^[^<>]*$/),
  body("listPrice").exists().withMessage("listPrice là bắt buộc").isFloat({ min: 0 }).toFloat(),
  body("stock").optional().custom((value) => mongoose.isObjectIdOrHexString(value) === false && Number.isInteger(Number(value)) && Number(value) >= 0).withMessage("stock phải là số nguyên không âm").toInt(),
  body("images").exists().withMessage("images là bắt buộc").isArray({ min: 1 }),
  body("images.*.url").exists().isURL({ protocols: ["http", "https"] }).withMessage("URL ảnh không hợp lệ"),
  body("images.*.publicId").exists().isString().trim().isLength({ min: 1, max: 255 }).withMessage("publicId ảnh là bắt buộc"),
  body("salePrice").optional({ nullable: true }).custom((value, { req }) => value == null || Number(value) < Number(req.body.listPrice)).withMessage("salePrice phải nhỏ hơn listPrice"),
];

export const validateUpdateProduct = [
  ...commonFields,
  body("stock").custom((value) => value === undefined).withMessage("Trường stock không được phép trong API sửa sản phẩm"),
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => {
    const allowed = new Set(["name", "slug", "categoryId", "brand", "listPrice", "salePrice", "status", "images", "specs", "warranty", "seo"]);
    return Object.keys(value || {}).every((key) => allowed.has(key));
  }).withMessage("Chứa trường không được phép"),
  body("salePrice").optional({ nullable: true }).custom((value, { req }) => value == null || req.body.listPrice == null || Number(value) < Number(req.body.listPrice)).withMessage("salePrice phải nhỏ hơn listPrice"),
];

export const validateProductStatus = [
  body("status").exists().withMessage("status là bắt buộc").isIn(statuses).withMessage("status không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => key === "status")).withMessage("Chỉ cho phép trường status"),
];
