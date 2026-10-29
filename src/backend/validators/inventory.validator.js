import { body, query } from "express-validator";
import mongoose from "mongoose";

const MAX_STOCK_ADJUSTMENT = 10000;

function normalizeInventoryType(value) {
	if (typeof value !== "string") return null;
	const key = value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[\s_-]+/g, "");

	if (["add", "increase", "increasestock", "import", "nhapthem", "adminadd"].includes(key)) return "admin_add";
	if (["subtract", "decrease", "decreasestock", "export", "giam", "adminsubtract"].includes(key)) return "admin_subtract";
	if (["count", "reset", "set", "inventorycount", "datlai", "admincount"].includes(key)) return "admin_count";
	return null;
}

export const validateInventoryList = [
	query("page").optional().isInt({ min: 1 }).withMessage("page phải là số nguyên dương").toInt(),
	query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit phải từ 1 đến 100").toInt(),
	query("search").optional().isString().withMessage("search phải là chuỗi").isLength({ max: 100 }).withMessage("search tối đa 100 ký tự").trim(),
	query("outOfStock").optional().isIn(["true", "false", "1", "0", true, false]).withMessage("outOfStock phải là true hoặc false").toBoolean(),
];

export const validateAdjustInventory = [
	body().custom((value) => typeof value === "object" && value !== null && !Array.isArray(value)).withMessage("Body không hợp lệ"),
	body().custom((value) => {
		const allowed = new Set(["productId", "type", "quantity", "reason", "currentSeenStock", "referenceId", "orderId", "orderCode"]);
		return Object.keys(value || {}).every((field) => allowed.has(field));
	}).withMessage("Chứa trường không được phép"),
	body("productId")
		.exists().withMessage("productId là bắt buộc")
		.bail()
		.isString().withMessage("productId phải là chuỗi")
		.bail()
		.custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("productId không hợp lệ"),
	body("type")
		.exists().withMessage("type là bắt bắt buộc")
		.bail()
		.isString().withMessage("type phải là chuỗi")
		.bail()
		.custom((value) => normalizeInventoryType(value) !== null).withMessage("type chỉ nhận add, subtract hoặc count"),
	body("quantity")
		.exists().withMessage("quantity là bắt buộc")
		.bail()
		.custom((value) => typeof value === "number" && Number.isInteger(value)).withMessage("quantity phải là số nguyên")
		.bail()
		.custom((value, { req }) => {
			const type = normalizeInventoryType(req.body.type);
			if (type === "admin_count") return value >= 0 && value <= MAX_STOCK_ADJUSTMENT;
			return value >= 1 && value <= MAX_STOCK_ADJUSTMENT;
		}).withMessage(`quantity phải thuộc phạm vi cho phép và tối đa ${MAX_STOCK_ADJUSTMENT}`),
	body("reason")
		.exists().withMessage("reason là bắt buộc")
		.bail()
		.isString().withMessage("reason phải là chuỗi")
		.bail()
		.trim()
		.isLength({ min: 1, max: 500 }).withMessage("reason phải từ 1 đến 500 ký tự")
		.matches(/^[^<>]*$/).withMessage("reason không được chứa mã HTML"),
	body("currentSeenStock")
		.optional()
		.custom((value) => typeof value === "number" && Number.isInteger(value) && value >= 0)
		.withMessage("currentSeenStock phải là số nguyên không âm"),
	body().custom((value) => {
		if (!value || typeof value !== "object") return true;
		const type = normalizeInventoryType(value.type);
		return type !== "admin_count" || Object.prototype.hasOwnProperty.call(value, "currentSeenStock");
	}).withMessage("currentSeenStock là bắt buộc khi type=count"),
	body("referenceId")
		.optional()
		.isString().withMessage("referenceId phải là chuỗi")
		.custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("referenceId không hợp lệ"),
	body("orderId")
		.optional()
		.isString().withMessage("orderId phải là chuỗi")
		.custom((value) => mongoose.isObjectIdOrHexString(value)).withMessage("orderId không hợp lệ"),
	body("orderCode")
		.optional()
		.isString().withMessage("orderCode phải là chuỗi")
		.trim()
		.isLength({ min: 1, max: 100 }).withMessage("orderCode tối đa 100 ký tự"),
	body().custom((value) => {
		if (!value || typeof value !== "object") return true;
		if (value.referenceId && value.orderId && value.referenceId !== value.orderId) return false;
		return true;
	}).withMessage("referenceId và orderId không được chỉ định hai đơn hàng khác nhau"),
];
