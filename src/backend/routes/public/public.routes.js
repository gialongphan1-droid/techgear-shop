import { Router } from "express";
import { listProducts, semanticSearch, getSimilarProducts, getProduct, listCategories, listBanners } from "../../controllers/public/public.controller.js";
import { semanticSearchRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validatePublicProductList, validatePublicProductSlug } from "../../validators/public/public.validator.js";

const router = Router();

router.get("/products", validatePublicProductList, listProducts);
router.get("/products/semantic-search", semanticSearchRateLimiter, semanticSearch);
router.get("/products/:id/similar", getSimilarProducts);
router.get("/products/:slug", validatePublicProductSlug, getProduct);
router.get("/categories", listCategories);
router.get("/banners", listBanners);

export default router;
