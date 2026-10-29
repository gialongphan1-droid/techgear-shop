import { validationResult } from "express-validator";
import * as service from "../services/banner.service.js";

function validationError(res, req) { const errors = validationResult(req); if (errors.isEmpty()) return null; return res.status(422).json({ success: false, message: "Dữ liệu không hợp lệ", data: {}, errors: errors.array().map((error) => ({ field: error.path, message: error.msg })) }); }
async function run(res, next, operation, message, status = 200) { try { const data = await operation(); return res.status(status).json({ success: true, message, data, errors: [] }); } catch (error) { return next(error); } }
export function listBanners(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.listBannersAdmin(req.query), "Lấy danh sách banner thành công"); }
export function getBanner(req, res, next) { return run(res, next, () => service.getBannerAdmin(req.params.id), "Lấy banner thành công"); }
export function createBanner(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.createBannerAdmin(req.body), "Tạo banner thành công", 201); }
export function updateBanner(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.updateBannerAdmin(req.params.id, req.body), "Cập nhật banner thành công"); }
export function updateBannerActive(req, res, next) { const validation = validationError(res, req); if (validation) return validation; return run(res, next, () => service.setBannerActiveAdmin(req.params.id, req.body.isActive), "Cập nhật trạng thái banner thành công"); }
export function deleteBanner(req, res, next) { return run(res, next, () => service.deleteBannerAdmin(req.params.id), "Xóa banner thành công"); }
