import "../models/Category.js";
import Product from "../models/Product.js";
import { client, collectionName } from "../config/qdrant.js";
import { embedText } from "./embedding.service.js";
import myCache from "../utils/cache.js";

const SEMANTIC_CACHE_TTL_SECONDS = 5 * 60;
const DEFAULT_SIMILARITY_THRESHOLD = 0.82;
const SIMILARITY_THRESHOLD = Number(
  process.env.SEMANTIC_SEARCH_THRESHOLD ?? DEFAULT_SIMILARITY_THRESHOLD,
);

if (!Number.isFinite(SIMILARITY_THRESHOLD) || SIMILARITY_THRESHOLD < 0 || SIMILARITY_THRESHOLD > 1) {
  throw new Error("SEMANTIC_SEARCH_THRESHOLD phải là số từ 0 đến 1");
}

export async function semanticSearchProducts(query, limit = 10) {
  const normalizedQuery = query.trim();
  const cacheKey = `semantic:${normalizedQuery}:${limit}:${SIMILARITY_THRESHOLD}`;
  const cached = myCache.get(cacheKey);
  if (cached) return cached;

  const vector = await embedText(normalizedQuery);
  const result = await client.query(collectionName, {
    query: vector,
    limit,
    with_payload: true,
  });
  const filteredResults = (result.points || []).filter(
    (point) => point.score >= SIMILARITY_THRESHOLD,
  );
  const scoredIds = filteredResults
    .filter((point) => point.payload?.productId)
    .map((point) => ({
      productId: String(point.payload.productId),
      similarityScore: point.score,
    }));

  if (scoredIds.length === 0) {
    const emptyResult = { query: normalizedQuery, items: [], total: 0 };
    myCache.set(cacheKey, emptyResult, SEMANTIC_CACHE_TTL_SECONDS);
    return emptyResult;
  }

  const products = await Product.find({
    _id: { $in: scoredIds.map((point) => point.productId) },
    status: "ACTIVE",
  })
    .select("name slug categoryId brand listPrice salePrice status images specs warranty seo createdAt")
    .populate("categoryId", "name slug")
    .lean();

  const scoreByProductId = new Map(
    scoredIds.map(({ productId, similarityScore }) => [productId, similarityScore]),
  );
  const items = products
    .map((product) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map(({ url, isPrimary }) => ({ url, isPrimary }))
        : [],
      similarityScore: scoreByProductId.get(String(product._id)),
    }))
    .sort((left, right) => right.similarityScore - left.similarityScore);

  const response = { query: normalizedQuery, items, total: items.length };
  myCache.set(cacheKey, response, SEMANTIC_CACHE_TTL_SECONDS);
  return response;
}
