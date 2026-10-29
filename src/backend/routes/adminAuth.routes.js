import { Router } from "express";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminAuth.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { validateLogin } from "../validators/adminAuth.validator.js";

const router = Router();

router.post("/login", checkOrigin, loginRateLimiter, validateLogin, loginAdmin);
router.get("/me", requireAdmin, getCurrentAdmin);
router.post("/logout", checkOrigin, requireCsrf, requireAdmin, logoutAdmin);

export default router;
