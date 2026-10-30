import axiosClient from "../api/axiosClient.js";

export const registerCustomer = (payload) =>
  axiosClient.post("/auth/register", payload);
export const loginCustomer = (credentials) =>
  axiosClient.post("/auth/login", credentials);
export const verifyCustomerEmail = (token) =>
  axiosClient.get("/auth/verify-email", { params: { token } });
export const getCurrentCustomer = () =>
  axiosClient.get("/auth/me", { skipAuthRedirect: true });
export const logoutCustomer = () => axiosClient.post("/auth/logout");
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
export const getCustomerOrders = (params = { page: 1, limit: 10 }) =>
  axiosClient.get("/orders/my-orders", { params });
