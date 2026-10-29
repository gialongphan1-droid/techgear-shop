import { body, param, query } from "express-validator";
import mongoose from "mongoose";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
];

export const validateAdminOrderList = [
  query().custom((value) =>
    typeof value === "object"
      && value !== null
      && !Array.isArray(value)
      && Object.keys(value).every((key) =>
        ["page", "limit", "status", "search", "overdue", "pendingOverdue"].includes(key),
      ),
  ).withMessage("Chứa tham số truy vấn không được phép"),
  query("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên dương").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100").toInt(),
  query("status").optional().isIn(ORDER_STATUSES).withMessage("status không hợp lệ"),
  query("search").optional().isString().withMessage("search phải là chuỗi").trim()
    .isLength({ max: 100 }).withMessage("search tối đa 100 ký tự"),
  query("overdue").optional()
    .isIn(["true", "false", "1", "0", true, false])
    .withMessage("overdue phải là true hoặc false")
    .toBoolean(),
  query("pendingOverdue").optional()
    .isIn(["true", "false", "1", "0", true, false])
    .withMessage("pendingOverdue phải là true hoặc false")
    .toBoolean(),
];

export const validateAdminOrderId = [
  param("id")
    .isString().withMessage("id đơn hàng phải là chuỗi")
    .bail()
    .custom((value) => mongoose.isObjectIdOrHexString(value))
    .withMessage("id đơn hàng không hợp lệ"),
];

export const validateAdminOrderStatusUpdate = [
  body().custom((value) => typeof value === "object" && value !== null && !Array.isArray(value))
    .withMessage("Body không hợp lệ"),
  body().custom((value) =>
    typeof value === "object"
      && value !== null
      && !Array.isArray(value)
      && Object.keys(value).every((key) => ["status", "currentStatus", "reason", "note"].includes(key)),
  ).withMessage("Chứa trường không được phép"),
  body("status")
    .exists().withMessage("status là bắt buộc")
    .bail()
    .isString().withMessage("status phải là chuỗi")
    .bail()
    .isIn(ORDER_STATUSES).withMessage("status không hợp lệ"),
  body("currentStatus")
    .exists().withMessage("currentStatus là bắt buộc")
    .bail()
    .isString().withMessage("currentStatus phải là chuỗi")
    .bail()
    .isIn(ORDER_STATUSES).withMessage("currentStatus không hợp lệ"),
  body("reason")
    .optional()
    .isString().withMessage("reason phải là chuỗi")
    .bail()
    .trim()
    .isLength({ max: 500 }).withMessage("reason tối đa 500 ký tự")
    .matches(/^[^<>]*$/).withMessage("reason không được chứa mã HTML"),
  body("note")
    .optional()
    .isString().withMessage("note phải là chuỗi")
    .bail()
    .trim()
    .isLength({ max: 500 }).withMessage("note tối đa 500 ký tự")
    .matches(/^[^<>]*$/).withMessage("note không được chứa mã HTML"),
];
