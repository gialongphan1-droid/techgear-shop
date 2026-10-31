import { client, collectionName, objectIdToUuid } from "../config/qdrant.js";
import "../models/Category.js";
import Product from "../models/Product.js";
import myCache from "../utils/cache.js";

const SIMILAR_PRODUCTS_CACHE_TTL_SECONDS = 5 * 60;

export async function getSimilarProducts(productId, limit = 5) {
  const cacheKey = `similar:${productId}:${limit}`;
  const cached = myCache.get(cacheKey);
  if (cached) return cached;

  const currentPoints = await client.retrieve(collectionName, {
    ids: [objectIdToUuid(productId)],
    with_vector: true,
    with_payload: true,
  });
  const currentPoint = currentPoints[0];
  if (!currentPoint) {
    const result = { items: [], total: 0, reason: "product_not_indexed" };
    myCache.set(cacheKey, result, SIMILAR_PRODUCTS_CACHE_TTL_SECONDS);
    return result;
  }

  const vector = currentPoint.vector;
  if (!Array.isArray(vector) || !vector.every(Number.isFinite)) {
    throw new Error(`Qdrant point for product ${productId} does not contain a dense vector`);
  }

  const searchResult = await client.query(collectionName, {
    query: vector,
    limit: limit + 1,
    with_payload: true,
    filter: {
      must_not: [{ key: "productId", match: { value: productId } }],
    },
  });
  const scoreMap = new Map();
  for (const point of (searchResult.points || []).slice(0, limit)) {
    const relatedProductId = point.payload?.productId;
    if (relatedProductId) scoreMap.set(String(relatedProductId), point.score);
  }

  if (scoreMap.size === 0) {
    const result = { items: [], total: 0 };
    myCache.set(cacheKey, result, SIMILAR_PRODUCTS_CACHE_TTL_SECONDS);
    return result;
  }

  const products = await Product.find({
    _id: { $in: [...scoreMap.keys()] },
    status: "ACTIVE",
  })
    .select("name slug categoryId brand listPrice salePrice status images specs warranty seo createdAt")
    .populate("categoryId", "name slug")
    .lean();

  const items = products
    .map((product) => ({
      ...product,
      images: Array.isArray(product.images)
        ? product.images.map(({ url, isPrimary }) => ({ url, isPrimary }))
        : [],
      similarityScore: scoreMap.get(String(product._id)),
    }))
    .sort((left, right) => right.similarityScore - left.similarityScore);
  const result = { items, total: items.length };
  myCache.set(cacheKey, result, SIMILAR_PRODUCTS_CACHE_TTL_SECONDS);
  return result;
}
