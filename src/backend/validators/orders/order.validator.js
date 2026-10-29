import { body } from "express-validator";

export const validateCreateOrder = [
  body().custom((value) => typeof value === "object" && value !== null && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => ["customerInfo", "idempotencyKey", "clientTotal"].includes(key))).withMessage("Chứa trường không được phép"),
  body("customerInfo").exists().withMessage("customerInfo là bắt buộc").bail()
    .custom((value) => typeof value === "object" && value !== null && !Array.isArray(value)).withMessage("customerInfo phải là object"),
  body("customerInfo").custom((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    return Object.keys(value).every((key) => ["fullName", "phone", "address", "note"].includes(key));
  }).withMessage("customerInfo chứa trường không được phép"),
  body("customerInfo.fullName").exists().withMessage("Họ tên là bắt buộc").bail()
    .isString().withMessage("Họ tên phải là chuỗi")
    .trim().isLength({ min: 2, max: 100 }).withMessage("Họ tên phải từ 2 đến 100 ký tự")
    .matches(/^[^<>]*$/).withMessage("Họ tên không được chứa mã HTML"),
  body("customerInfo.phone").exists().withMessage("Số điện thoại là bắt buộc").bail()
    .isString().withMessage("Số điện thoại phải là chuỗi")
    .matches(/^0\d{9}$/).withMessage("Số điện thoại phải gồm đúng 10 chữ số"),
  body("customerInfo.address").exists().withMessage("Địa chỉ là bắt buộc").bail()
    .isString().withMessage("Địa chỉ phải là chuỗi")
    .trim().isLength({ min: 5, max: 500 }).withMessage("Địa chỉ phải từ 5 đến 500 ký tự")
    .matches(/^[^<>]*$/).withMessage("Địa chỉ không được chứa mã HTML"),
  body("customerInfo.note").optional()
    .isString().withMessage("Ghi chú phải là chuỗi")
    .trim().isLength({ max: 500 }).withMessage("Ghi chú tối đa 500 ký tự")
    .matches(/^[^<>]*$/).withMessage("Ghi chú không được chứa mã HTML"),
  body("idempotencyKey").exists().withMessage("idempotencyKey là bắt buộc").bail()
    .isString().withMessage("idempotencyKey phải là chuỗi")
    .isUUID().withMessage("idempotencyKey phải có định dạng UUID/GUID"),
  body("clientTotal").exists().withMessage("clientTotal là bắt buộc").bail()
    .custom((value) => typeof value === "number" && Number.isFinite(value) && value >= 0).withMessage("clientTotal phải là số không âm")
    .custom((value) => Number.isSafeInteger(Math.round(value * 100))).withMessage("clientTotal không hợp lệ"),
];

export const validateTrackOrder = [
  body().custom((value) => typeof value === "object" && value !== null && !Array.isArray(value)).withMessage("Body không hợp lệ"),
  body().custom((value) => Object.keys(value || {}).every((key) => ["orderCode", "trackCode"].includes(key))).withMessage("Chứa trường không được phép"),
  body("orderCode").exists().withMessage("orderCode là bắt buộc").bail()
    .isString().withMessage("orderCode phải là chuỗi")
    .trim()
    .matches(/^TG-\d{8}-[A-F0-9]{10}$/i).withMessage("orderCode không hợp lệ"),
  body("trackCode").exists().withMessage("trackCode là bắt buộc").bail()
    .isString().withMessage("trackCode phải là chuỗi")
    .trim()
    .isUUID().withMessage("trackCode phải có định dạng UUID/GUID"),
];
