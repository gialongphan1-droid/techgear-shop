import test from "node:test";
import assert from "node:assert/strict";
import {
  buildActiveProductFilter,
  normalizeProductStock,
} from "../services/public/productSearch.helpers.js";
import myCache from "../utils/cache.js";

test("normalizes product stock to a non-negative integer", () => {
  assert.equal(normalizeProductStock(14.8), 14);
  assert.equal(normalizeProductStock(-3), 0);
  assert.equal(normalizeProductStock(undefined), 0);
});

test("filters product searches to active products in active categories", () => {
  const productIds = ["product-1", "product-2"];
  const activeCategoryIds = ["category-1"];

  assert.deepEqual(
    buildActiveProductFilter(productIds, activeCategoryIds),
    {
      _id: { $in: productIds },
      status: "ACTIVE",
      categoryId: { $in: activeCategoryIds },
    },
  );
});

test("default product cache entries expire within five seconds", () => {
  const key = `test:product-cache:${Date.now()}`;
  try {
    myCache.set(key, true);
    const expiresAt = myCache.getTtl(key);
    const checkedAt = Date.now();
    assert.ok(expiresAt > checkedAt);
    assert.ok(expiresAt <= checkedAt + 5000);
  } finally {
    myCache.del(key);
  }
});
