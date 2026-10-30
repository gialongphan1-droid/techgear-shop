import { Router } from "express";
import { createOrder, trackOrder } from "../../controllers/orders/order.controller.js";
import { checkOrigin } from "../../middleware/origin.middleware.js";
import { requireCsrf } from "../../middleware/csrf.middleware.js";
import { requireCustomerAuth } from "../../middleware/customerAuth.middleware.js";
import { orderRateLimiter, trackOrderIpRateLimiter, trackOrderCodeRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validateCreateOrder, validateTrackOrder } from "../../validators/orders/order.validator.js";

const router = Router();

router.post("/orders/track", trackOrderIpRateLimiter, trackOrderCodeRateLimiter, validateTrackOrder, trackOrder);
router.post("/orders", requireCustomerAuth, orderRateLimiter, checkOrigin, requireCsrf, validateCreateOrder, createOrder);

export default router;
