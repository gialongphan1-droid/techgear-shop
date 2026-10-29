import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
  updateProductStatus,
} from "../controllers/product.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireCsrf } from "../middleware/csrf.middleware.js";
import { checkOrigin } from "../middleware/origin.middleware.js";
import {
  validateCreateProduct,
  validateListProducts,
  validateProductId,
  validateProductStatus,
  validateUpdateProduct,
} from "../validators/product.validator.js";

const router = Router();

router.use(requireAdmin);

router.get("/products", validateListProducts, listProducts);
router.get("/products/:id", validateProductId, getProduct);
router.post("/products", checkOrigin, requireCsrf, validateCreateProduct, createProduct);
router.put("/products/:id", checkOrigin, requireCsrf, validateProductId, validateUpdateProduct, updateProduct);
router.patch("/products/:id/status", checkOrigin, requireCsrf, validateProductId, validateProductStatus, updateProductStatus);
router.delete("/products/:id", checkOrigin, requireCsrf, validateProductId, deleteProduct);

export default router;
