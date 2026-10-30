import axios, { AxiosHeaders } from "axios";
import store from "../store/index.js";
import { selectCsrfToken } from "../store/adminSessionSlice.js";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

function getCsrfCookie() {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("csrf_token="));

  return cookie ? decodeURIComponent(cookie.slice("csrf_token=".length)) : null;
}

axiosClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const isWriteRequest = ["post", "put", "patch", "delete"].includes(method);

  if (isWriteRequest) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set(
      "x-csrf-token",
      selectCsrfToken(store.getState()) || getCsrfCookie() || "",
    );
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && window.location.pathname.startsWith("/admin")) {
      if (window.location.pathname !== "/admin/login") {
        const returnTo = encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        );
        window.location.assign(`/admin/login?returnTo=${returnTo}`);
      }
    }

    if (status === 403) {
      window.dispatchEvent(
        new CustomEvent("api:forbidden", {
          detail: "Yêu cầu bị từ chối. Vui lòng kiểm tra phiên đăng nhập và thử lại.",
        }),
      );
    }

    if (status === 429) {
      window.dispatchEvent(
        new CustomEvent("api:rate-limit", {
          detail: "Yêu cầu quá nhanh. Vui lòng chờ trước khi thử lại.",
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
