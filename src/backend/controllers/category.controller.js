import { validationResult } from "express-validator";
import * as service from "../services/category.service.js";

function validationError(res, req) { const errors = validationResult(req); if (errors.isEmpty()) return null; return res.status(422).json({ success: false, message: "Dữ liệu không hợp lệ", data: {}, errors: errors.array().map((error) => ({ field: error.path, message: error.msg })) }); }
async function run(res, next, operation, message, status = 200) { try { const data = await operation(); return res.status(status).json({ success: true, message, data, errors: [] }); } catch (error) { return next(error); } }
export function listCategories(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.listCategoriesAdmin(req.query), "Lấy danh sách danh mục thành công"); }
export function getCategory(req, res, next) { return run(res, next, () => service.getCategoryAdmin(req.params.id), "Lấy danh mục thành công"); }
export function createCategory(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.createCategoryAdmin(req.body), "Tạo danh mục thành công", 201); }
export function updateCategory(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.updateCategoryAdmin(req.params.id, req.body), "Cập nhật danh mục thành công"); }
export function updateCategoryActive(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.setCategoryActiveAdmin(req.params.id, req.body.isActive), "Cập nhật trạng thái danh mục thành công"); }
export function deleteCategory(req, res, next) { return run(res, next, () => service.deleteCategoryAdmin(req.params.id), "Xóa danh mục thành công"); }
