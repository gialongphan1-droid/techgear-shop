import mongoose from "mongoose";
import { body, param, query } from "express-validator";

export const validateBannerId = [param("id").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("ID banner không hợp lệ")];
export const validateListBanners = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("position").optional().isString().trim().isLength({ min: 1, max: 100 }),
  query("isActive").optional().isIn(["true", "false"]).toBoolean(),
];
const allowed = (fields) => body().custom((value) => typeof value === "object" && !Array.isArray(value) && Object.keys(value || {}).every((key) => fields.has(key))).withMessage("Chứa trường không được phép");
const linkUrl = body("linkUrl").custom((value) => {
  if (typeof value !== "string") return false;
  if (/^javascript:/i.test(value.trim())) return false;
  return value.trim().startsWith("/") || /^https?:\/\//i.test(value.trim());
}).withMessage("linkUrl chỉ nhận đường dẫn nội bộ hoặc URL http/https");

export const validateCreateBanner = [
  allowed(new Set(["title", "imageUrl", "publicId", "linkUrl", "position", "isActive"])),
  body("title").exists().isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/).withMessage("Tiêu đề banner phải từ 2-100 ký tự và không chứa HTML"),
  body("imageUrl").exists().isURL({ protocols: ["http", "https"] }).withMessage("imageUrl phải là URL http/https hợp lệ"),
  body("publicId").exists().isString().trim().isLength({ min: 1, max: 255 }).withMessage("publicId là bắt buộc"),
  linkUrl,
  body("position").exists().isString().trim().isLength({ min: 1, max: 100 }).matches(/^[A-Z0-9_-]+$/).withMessage("position không hợp lệ"),
  body("isActive").optional().isBoolean().toBoolean(),
];
export const validateUpdateBanner = [
  allowed(new Set(["title", "imageUrl", "publicId", "linkUrl", "position", "isActive"])),
  body("title").optional().isString().trim().isLength({ min: 2, max: 100 }).matches(/^[^<>]*$/).withMessage("Tiêu đề banner phải từ 2-100 ký tự và không chứa HTML"),
  body("imageUrl").optional().isURL({ protocols: ["http", "https"] }).withMessage("imageUrl phải là URL http/https hợp lệ"),
  body("publicId").optional().isString().trim().isLength({ min: 1, max: 255 }),
  body("linkUrl").optional().custom((value) => {
    if (value === undefined) return true;
    return typeof value === "string" && !/^javascript:/i.test(value.trim()) && (value.trim().startsWith("/") || /^https?:\/\//i.test(value.trim()));
  }).withMessage("linkUrl chỉ nhận đường dẫn nội bộ hoặc URL http/https"),
  body("position").optional().isString().trim().isLength({ min: 1, max: 100 }).matches(/^[A-Z0-9_-]+$/).withMessage("position không hợp lệ"),
  body("isActive").optional().isBoolean().toBoolean(),
];
export const validateBannerActive = [body("isActive").exists().isBoolean().withMessage("isActive phải là boolean").toBoolean(), body().custom((value) => Object.keys(value || {}).every((key) => key === "isActive")).withMessage("Chỉ cho phép trường isActive")];
