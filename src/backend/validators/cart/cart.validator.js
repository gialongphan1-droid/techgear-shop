import { body, param } from "express-validator";
import mongoose from "mongoose";

const productIdField = (field) => field === "param"
  ? param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ")
  : body("productId").exists().withMessage("productId là bắt buộc").custom((value) => typeof value === "string" && mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ");

export const validateAddCartItem = [
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => ["productId", "quantity"].includes(key))).withMessage("Chứa trường không được phép"),
  productIdField("body"),
  body("quantity").exists().withMessage("quantity là bắt buộc").isInt({ min: 1, max: 10 }).withMessage("quantity phải là số nguyên từ 1 đến 10").toInt(),
];

export const validateUpdateCartItem = [
  param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ"),
  body().custom((value) => typeof value === "object" && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => key === "quantity")).withMessage("Chỉ cho phép trường quantity"),
  body("quantity").exists().withMessage("quantity là bắt buộc").isInt({ min: 0, max: 10 }).withMessage("quantity phải là số nguyên từ 0 đến 10").toInt(),
];

export const validateDeleteCartItem = [
  param("productId").custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ"),
];
