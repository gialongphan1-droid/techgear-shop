import { Router } from "express";
import { adjustInventoryAdmin, listInventoryAdmin } from "../controllers/inventory.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { inventoryAdjustRateLimiter } from "../middleware/rateLimit.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { validateAdjustInventory, validateInventoryList } from "../validators/inventory.validator.js";

const router = Router();

router.use(requireAdmin);

router.get("/inventory", validateInventoryList, listInventoryAdmin);
router.post(
	"/inventory/adjust",
	checkOrigin,
	requireCsrf,
	inventoryAdjustRateLimiter,
	validateAdjustInventory,
	adjustInventoryAdmin,
);

export default router;
