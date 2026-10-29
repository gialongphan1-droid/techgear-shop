import { Router } from "express";
import { uploadImage as uploadImageController } from "../controllers/adminUpload.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { uploadImage as uploadImageMiddleware } from "../middleware/upload.middleware.js";
import { adminUploadRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/upload",
  requireAdmin,
  checkOrigin,
  requireCsrf,
  adminUploadRateLimiter,
  uploadImageMiddleware,
  uploadImageController,
);

export default router;