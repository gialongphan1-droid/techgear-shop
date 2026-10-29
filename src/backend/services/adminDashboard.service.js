import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

export async function getAdminDashboardStats() {
  const [totalProducts, totalCategories, pendingOrders, completedRevenue] =
    await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments({
        status: { $in: ["PENDING", "Pending"] },
      }),
      Order.aggregate([
        {
          $match: {
            status: { $in: ["COMPLETED", "Completed"] },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            completedOrders: { $sum: 1 },
          },
        },
      ]),
    ]);

  const revenue = completedRevenue[0] || {
    totalRevenue: 0,
    completedOrders: 0,
  };

  return {
    totalProducts,
    totalCategories,
    pendingOrders,
    completedOrders: revenue.completedOrders,
    totalRevenue: revenue.totalRevenue || 0,
  };
}

export const getDashboardStats = getAdminDashboardStats;