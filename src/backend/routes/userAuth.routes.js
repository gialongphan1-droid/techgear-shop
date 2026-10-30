import { Router } from "express";
import { login, register, verifyEmail } from "../controllers/userAuth.controller.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import { validateUserLogin, validateUserRegistration, validateEmailVerification } from "../validators/userAuth.validator.js";

const router = Router();

router.post("/register", checkOrigin, validateUserRegistration, register);
router.get("/verify-email", validateEmailVerification, verifyEmail);
router.post("/login", checkOrigin, loginRateLimiter, validateUserLogin, login);

export default router;
