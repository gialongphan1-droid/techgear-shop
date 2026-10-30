import { Router } from "express";
import { createOrder, listMyOrders, trackOrder } from "../../controllers/orders/order.controller.js";
import { checkOrigin } from "../../middleware/origin.middleware.js";
import { requireCsrf } from "../../middleware/csrf.middleware.js";
import { requireCustomerAuth } from "../../middleware/customerAuth.middleware.js";
import { orderRateLimiter, trackOrderIpRateLimiter, trackOrderCodeRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validateCreateOrder, validateMyOrdersQuery, validateTrackOrder } from "../../validators/orders/order.validator.js";

const router = Router();

router.post("/orders/track", trackOrderIpRateLimiter, trackOrderCodeRateLimiter, validateTrackOrder, trackOrder);
router.get("/orders/my-orders", requireCustomerAuth, validateMyOrdersQuery, listMyOrders);
router.post("/orders", requireCustomerAuth, orderRateLimiter, checkOrigin, requireCsrf, validateCreateOrder, createOrder);

export default router;
