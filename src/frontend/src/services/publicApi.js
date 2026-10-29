import axiosClient from "../api/axiosClient.js";

export const getPublicBanners = () => axiosClient.get("/banners");
export const getPublicCategories = () => axiosClient.get("/categories");
export const getPublicProducts = (params) =>
  axiosClient.get("/products", { params });
export const getPublicProductBySlug = (slug) =>
  axiosClient.get(`/products/${encodeURIComponent(slug)}`);
export const getCustomerCart = () => axiosClient.get("/cart");
export const addCustomerCartItem = (payload) =>
  axiosClient.post("/cart/items", payload);
export const updateCustomerCartItem = (productId, payload) =>
  axiosClient.put(`/cart/items/${encodeURIComponent(productId)}`, payload);
export const deleteCustomerCartItem = (productId) =>
  axiosClient.delete(`/cart/items/${encodeURIComponent(productId)}`);
export const clearCustomerCart = () => axiosClient.delete("/cart");
export const createCustomerOrder = (payload) =>
  axiosClient.post("/orders", payload);
export const trackCustomerOrder = (payload) =>
  axiosClient.post("/orders/track", payload);
