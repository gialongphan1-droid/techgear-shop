import { validationResult } from "express-validator";
import { listPublicProducts, getPublicProductBySlug } from "../../services/public/publicProduct.service.js";
import { semanticSearchProducts } from "../../services/semanticSearch.service.js";
import { getSimilarProducts as fetchSimilarProducts } from "../../services/similarProducts.service.js";
import { listPublicCategories, listPublicBanners } from "../../services/public/publicCatalog.service.js";

function sendValidationError(res, req) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(422).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    data: {},
    errors: result.array().map((error) => ({ field: error.path, message: error.msg })),
  });
}

async function run(res, next, operation, message) {
  try {
    const data = await operation();
    return res.status(200).json({ success: true, message, data, errors: [] });
  } catch (error) {
    return next(error);
  }
}

export function listProducts(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => listPublicProducts(req.query), "Lấy danh sách sản phẩm thành công");
}

export function semanticSearch(req, res, next) {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (query.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Từ khóa tìm kiếm phải có ít nhất 2 ký tự",
      data: {},
      errors: [{ field: "q", message: "Từ khóa tìm kiếm phải có ít nhất 2 ký tự" }],
    });
  }

  if (process.env.ENABLE_SEMANTIC_SEARCH !== "true") {
    return res.status(503).json({
      success: false,
      message: "Tìm kiếm ngữ nghĩa hiện không khả dụng",
      data: {},
      errors: [],
    });
  }

  let limit = 10;
  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "limit phải là số nguyên từ 1 đến 100",
        data: {},
        errors: [{ field: "limit", message: "limit phải là số nguyên từ 1 đến 100" }],
      });
    }
  }

  return run(
    res,
    next,
    () => semanticSearchProducts(query, limit),
    "Tìm kiếm ngữ nghĩa thành công",
  );
}

export function getSimilarProducts(req, res, next) {
  const productId = req.params.id;
  if (typeof productId !== "string" || !/^[0-9a-fA-F]{24}$/.test(productId)) {
    return res.status(400).json({
      success: false,
      message: "ID sản phẩm không hợp lệ",
      data: {},
      errors: [{ field: "id", message: "ID sản phẩm phải là ObjectId hợp lệ" }],
    });
  }

  return run(
    res,
    next,
    async () => {
      const { items, total } = await fetchSimilarProducts(productId.toLowerCase());
      return { items, total };
    },
    "Lấy sản phẩm tương tự thành công",
  );
}

export function getProduct(req, res, next) {
  const validationError = sendValidationError(res, req);
  if (validationError) return validationError;
  return run(res, next, () => getPublicProductBySlug(req.params.slug), "Lấy chi tiết sản phẩm thành công");
}

export function listCategories(req, res, next) {
  return run(res, next, () => listPublicCategories(), "Lấy danh sách danh mục thành công");
}

export function listBanners(req, res, next) {
  return run(res, next, () => listPublicBanners(), "Lấy danh sách banner thành công");
}
