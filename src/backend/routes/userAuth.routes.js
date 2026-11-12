import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/userAuth.controller.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { requireCustomerAuth } from "../middleware/customerAuth.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import {
  validateChangePassword,
  validateEmailVerification,
  validateUserLogin,
  validateUserRegistration,
} from "../validators/userAuth.validator.js";

const router = Router();

router.get("/me", requireCustomerAuth, getCurrentUser);
router.put("/change-password", requireCustomerAuth, checkOrigin, requireCsrf, validateChangePassword, changePassword);
router.post("/register", checkOrigin, validateUserRegistration, register);
router.get("/verify-email", validateEmailVerification, verifyEmail);
router.post("/login", checkOrigin, loginRateLimiter, validateUserLogin, login);
router.post("/logout", checkOrigin, requireCsrf, logout);

export default router;
