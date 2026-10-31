const apiBaseUrl = process.env.PUBLIC_API_BASE_URL || "http://localhost:49523/api";
const apiOrigin = process.env.PUBLIC_API_ORIGIN || "http://localhost:5173";

async function getData(path) {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, "");
  const response = await fetch(new URL(path, `${normalizedBaseUrl}/`), {
    headers: { Origin: apiOrigin },
  });
  const payload = await response.json();
  if (!response.ok || payload.success !== true) {
    throw new Error(`GET ${path} failed with HTTP ${response.status}: ${payload.message || "Unknown error"}`);
  }
  return payload.data;
}

function assertCategoryProducts(items, categoryId, testName) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(`${testName}: expected at least one product`);
  }
  if (items.some((item) => String(item.categoryId) !== String(categoryId))) {
    throw new Error(`${testName}: response contains a product from another category`);
  }
}

async function main() {
  const { items: categories } = await getData("categories");
  let populatedCategory;

  for (const category of categories) {
    const { items } = await getData(`products?category=${encodeURIComponent(category.slug)}`);
    if (items.length > 0) {
      populatedCategory = category;
      break;
    }
  }

  if (!populatedCategory) {
    throw new Error("No active category with products is available for testing");
  }

  const bySlug = await getData(`products?category=${encodeURIComponent(populatedCategory.slug)}`);
  assertCategoryProducts(bySlug.items, populatedCategory._id, "Category slug filter");
  console.log("PASS: category slug returns only products from that category");

  const byId = await getData(`products?category=${encodeURIComponent(populatedCategory._id)}`);
  assertCategoryProducts(byId.items, populatedCategory._id, "Category ID filter");
  console.log("PASS: category ID returns only products from that category");

  const missing = await getData("products?category=slug_khong_ton_tai");
  if (!Array.isArray(missing.items) || missing.items.length !== 0) {
    throw new Error("Unknown category slug should return an empty product list");
  }
  console.log("PASS: unknown category slug returns an empty product list");
}

main().catch((error) => {
  console.error("Category filter tests failed:", error.message);
  process.exitCode = 1;
});
