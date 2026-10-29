import axiosClient from "../api/axiosClient.js";

export const loginAdmin = (credentials) =>
  axiosClient.post("/admin/login", credentials);
export const getCurrentAdmin = () => axiosClient.get("/admin/me");
export const logoutAdmin = () => axiosClient.post("/admin/logout");
export const getAdminProducts = (params) =>
  axiosClient.get("/admin/products", { params });
export const getAdminProduct = (id) =>
  axiosClient.get(`/admin/products/${encodeURIComponent(id)}`);
export const createAdminProduct = (product) =>
  axiosClient.post("/admin/products", product);
export const updateAdminProduct = (id, product) =>
  axiosClient.put(`/admin/products/${encodeURIComponent(id)}`, product);
export const deleteAdminProduct = (id) =>
  axiosClient.delete(`/admin/products/${encodeURIComponent(id)}`);
export const getAdminCategories = (params = { limit: 100 }) =>
  axiosClient.get("/admin/categories", { params });
export const createAdminCategory = (category) =>
  axiosClient.post("/admin/categories", category);
export const updateAdminCategory = (id, category) =>
  axiosClient.put(`/admin/categories/${encodeURIComponent(id)}`, category);
export const deleteAdminCategory = (id) =>
  axiosClient.delete(`/admin/categories/${encodeURIComponent(id)}`);
export const getAdminBanners = (params = {}) =>
  axiosClient.get("/admin/banners", { params });
export const createAdminBanner = (banner) =>
  axiosClient.post("/admin/banners", banner);
export const updateAdminBanner = (id, banner) =>
  axiosClient.put(`/admin/banners/${encodeURIComponent(id)}`, banner);
export const deleteAdminBanner = (id) =>
  axiosClient.delete(`/admin/banners/${encodeURIComponent(id)}`);
export const getAdminDashboard = () => axiosClient.get("/admin/dashboard");
export const uploadAdminImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axiosClient.post("/admin/upload", formData);
};
export const getAdminOrders = (params = {}) =>
  axiosClient.get("/admin/orders", { params });
export const getAdminOrder = (id) =>
  axiosClient.get(`/admin/orders/${encodeURIComponent(id)}`);
export const updateAdminOrderStatus = (id, payload) =>
  axiosClient.patch(`/admin/orders/${encodeURIComponent(id)}/status`, payload);
export const getAdminInventory = (params = {}) =>
  axiosClient.get("/admin/inventory", { params });
export const adjustAdminInventory = (payload) =>
  axiosClient.post("/admin/inventory/adjust", payload);
