export function normalizeProductStock(stock) {
  const parsedStock = Number(stock);
  if (stock == null || !Number.isFinite(parsedStock)) return 0;
  return Math.max(0, Math.trunc(parsedStock));
}

export function buildActiveProductFilter(productIds, activeCategoryIds) {
  return {
    _id: { $in: productIds },
    status: "ACTIVE",
    categoryId: { $in: activeCategoryIds },
  };
}
