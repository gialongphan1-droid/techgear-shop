import { getAdminDashboardStats } from "../services/adminDashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const data = await getAdminDashboardStats();
    return res.status(200).json({
      success: true,
      message: "Lấy thống kê Dashboard thành công",
      data,
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}