import { Router } from "express";
import { listProducts, getProduct, listCategories, listBanners } from "../../controllers/public/public.controller.js";
import { validatePublicProductList, validatePublicProductSlug } from "../../validators/public/public.validator.js";

const router = Router();

router.get("/products", validatePublicProductList, listProducts);
router.get("/products/:slug", validatePublicProductSlug, getProduct);
router.get("/categories", listCategories);
router.get("/banners", listBanners);

export default router;
