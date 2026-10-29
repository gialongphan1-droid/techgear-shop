import { Router } from "express";
import { addCartItem, clearCart, deleteCartItem, getCart, updateCartItem } from "../../controllers/cart/cart.controller.js";
import { checkOrigin } from "../../middleware/origin.middleware.js";
import { requireCsrf } from "../../middleware/csrf.middleware.js";
import { cartRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validateAddCartItem, validateDeleteCartItem, validateUpdateCartItem } from "../../validators/cart/cart.validator.js";

const router = Router();

router.use("/cart", cartRateLimiter);

router.get("/cart", getCart);
router.post("/cart/items", checkOrigin, requireCsrf, validateAddCartItem, addCartItem);
router.put("/cart/items/:productId", checkOrigin, requireCsrf, validateUpdateCartItem, updateCartItem);
router.delete("/cart/items/:productId", checkOrigin, requireCsrf, validateDeleteCartItem, deleteCartItem);
router.delete("/cart", checkOrigin, requireCsrf, clearCart);

export default router;
