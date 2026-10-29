import { Router } from "express";
import {
  createCategory, deleteCategory, getCategory, listCategories, updateCategory, updateCategoryActive,
} from "../controllers/category.controller.js";
import {
  createBanner, deleteBanner, getBanner, listBanners, updateBanner, updateBannerActive,
} from "../controllers/banner.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import { validateCategoryId, validateListCategories, validateCreateCategory, validateUpdateCategory, validateCategoryActive } from "../validators/category.validator.js";
import { validateBannerId, validateListBanners, validateCreateBanner, validateUpdateBanner, validateBannerActive } from "../validators/banner.validator.js";

const router = Router();
router.use(requireAdmin);

router.get("/categories", validateListCategories, listCategories);
router.get("/categories/:id", validateCategoryId, getCategory);
router.post("/categories", checkOrigin, requireCsrf, validateCreateCategory, createCategory);
router.put("/categories/:id", checkOrigin, requireCsrf, validateUpdateCategory, updateCategory);
router.patch("/categories/:id/status", checkOrigin, requireCsrf, validateCategoryId, validateCategoryActive, updateCategoryActive);
router.delete("/categories/:id", checkOrigin, requireCsrf, validateCategoryId, deleteCategory);

router.get("/banners", validateListBanners, listBanners);
router.get("/banners/:id", validateBannerId, getBanner);
router.post("/banners", checkOrigin, requireCsrf, validateCreateBanner, createBanner);
router.put("/banners/:id", checkOrigin, requireCsrf, validateBannerId, validateUpdateBanner, updateBanner);
router.patch("/banners/:id/status", checkOrigin, requireCsrf, validateBannerId, validateBannerActive, updateBannerActive);
router.delete("/banners/:id", checkOrigin, requireCsrf, validateBannerId, deleteBanner);

export default router;
