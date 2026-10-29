import { Router } from "express";
import {
  getOrderAdmin,
  listOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/adminOrder.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { adminOrderStatusRateLimiter } from "../middleware/rateLimit.middleware.js";
import {
  validateAdminOrderId,
  validateAdminOrderList,
  validateAdminOrderStatusUpdate,
} from "../validators/adminOrder.validator.js";

const router = Router();

router.use(requireAdmin);

router.get("/orders", validateAdminOrderList, listOrdersAdmin);
router.get("/orders/:id", validateAdminOrderId, getOrderAdmin);
router.patch(
  "/orders/:id/status",
  checkOrigin,
  requireCsrf,
  adminOrderStatusRateLimiter,
  validateAdminOrderId,
  validateAdminOrderStatusUpdate,
  updateOrderStatusAdmin,
);

export default router;
