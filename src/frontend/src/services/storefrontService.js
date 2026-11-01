import {
  getPublicBanners,
  getPublicCategories,
  getPublicProductBySlug,
  getPublicProducts,
  getPublicSimilarProducts,
  getPublicSemanticSearch,
} from "./publicApi.js";

export async function getStorefrontBanners() {
  const response = await getPublicBanners();
  return response.data;
}

export async function getStorefrontCategories() {
  const response = await getPublicCategories();
  return response.data;
}

export async function getStorefrontProducts(params = {}) {
  const response = await getPublicProducts(params);
  return response.data;
}

export async function getStorefrontSemanticSearch(query) {
  const response = await getPublicSemanticSearch(query);
  return response.data;
}

export async function getStorefrontProductBySlug(slug) {
  const response = await getPublicProductBySlug(slug);
  return response.data;
}

export async function getStorefrontSimilarProducts(productId) {
  const response = await getPublicSimilarProducts(productId);
  return response.data;
}
