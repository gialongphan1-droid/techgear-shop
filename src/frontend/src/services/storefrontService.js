import {
  getPublicBanners,
  getPublicCategories,
  getPublicProductBySlug,
  getPublicProducts,
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

export async function getStorefrontProductBySlug(slug) {
  const response = await getPublicProductBySlug(slug);
  return response.data;
}
