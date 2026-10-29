import { Router } from "express";
import { getDashboard } from "../controllers/adminDashboard.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", requireAdmin, getDashboard);

export default router;