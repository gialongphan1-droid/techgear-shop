import mongoose from "mongoose";
import { body, param, query } from "express-validator";

export const validateCategoryId = [param("id").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("ID danh mục không hợp lệ")];
export const validateListCategories = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("search").optional().isString().trim().isLength({ max: 100 }),
  query("isActive").optional().isIn(["true", "false"]).toBoolean(),
];
const slug = body("slug").optional().isString().trim().isLength({ min: 1, max: 150 }).matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i).withMessage("Slug không hợp lệ");
const allowed = (fields) => body().custom((value) => typeof value === "object" && !Array.isArray(value) && Object.keys(value || {}).every((key) => fields.has(key))).withMessage("Chứa trường không được phép");

export const validateCreateCategory = [
  allowed(new Set(["name", "slug", "description", "iconUrl", "isActive"])),
  body("name").exists().isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/).withMessage("Tên danh mục phải từ 2-100 ký tự và không chứa HTML"),
  slug,
  body("description").optional().isString().trim().isLength({ max: 500 }),
  body("iconUrl").optional({ nullable: true }).isString().trim().isURL({ protocols: ["http", "https"] }).withMessage("iconUrl phải là URL http/https hợp lệ"),
  body("isActive").optional().isBoolean().toBoolean(),
];
export const validateUpdateCategory = [
  validateCategoryId[0],
  allowed(new Set(["name", "slug", "description", "iconUrl", "isActive"])),
  body("name").optional().isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/).withMessage("Tên danh mục phải từ 2-100 ký tự và không chứa HTML"),
  slug,
  body("description").optional().isString().trim().isLength({ max: 500 }),
  body("iconUrl").optional({ nullable: true }).isString().trim().isURL({ protocols: ["http", "https"] }).withMessage("iconUrl phải là URL http/https hợp lệ"),
  body("isActive").optional().isBoolean().toBoolean(),
];
export const validateCategoryActive = [body("isActive").exists().isBoolean().withMessage("isActive phải là boolean").toBoolean(), body().custom((value) => Object.keys(value || {}).every((key) => key === "isActive")).withMessage("Chỉ cho phép trường isActive")];
