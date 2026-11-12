import { body, param } from "express-validator";
import mongoose from "mongoose";

const productIdField = (field) => field === "param"
  ? param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ")
  : body("productId").exists().withMessage("productId là bắt buộc").custom((value) => typeof value === "string" && mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ");

export const validateAddCartItem = [
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => ["productId", "quantity", "note"].includes(key))).withMessage("Chứa trường không được phép"),
  productIdField("body"),
  body("quantity").exists().withMessage("quantity là bắt buộc").isInt({ min: 1, max: 50 }).withMessage("quantity phải là số nguyên từ 1 đến 50").toInt(),
  body("note").optional().isString().withMessage("note phải là chuỗi").isLength({ max: 500 }).withMessage("note tối đa 500 ký tự"),
];

export const validateUpdateCartItem = [
  param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ"),
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => ["quantity", "note"].includes(key))).withMessage("Chỉ cho phép trường quantity và note"),
  body("quantity").exists().withMessage("quantity là bắt buộc").isInt({ min: 0, max: 50 }).withMessage("quantity phải là số nguyên từ 0 đến 50").toInt(),
  body("note").optional().isString().withMessage("note phải là chuỗi").isLength({ max: 500 }).withMessage("note tối đa 500 ký tự"),
];

export const validateDeleteCartItem = [
  param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ"),
];
