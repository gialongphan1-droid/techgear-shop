import axios, { AxiosHeaders } from "axios";
import store from "../store/index.js";
import { selectCsrfToken } from "../store/adminSessionSlice.js";
import {
  clearCustomerSession,
} from "../store/userAuthSlice.js";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

function getRequestPath(config) {
  const requestUrl = config?.url || "";
  const path = requestUrl.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/, 1)[0];
  return path.replace(/^\/api(?=\/)/, "");
}

function isAuthEndpoint(method, path) {
  return (
    (method === "post" &&
      ["/auth/login", "/auth/register", "/admin/login"].includes(path)) ||
    (method === "get" && ["/auth/me", "/admin/me"].includes(path))
  );
}

function isSafeInternalPath(path) {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.includes("://") &&
    !path.includes("//")
  );
}

function getRetryAfterSeconds(headers) {
  const retryAfter = headers?.get?.("Retry-After") ?? headers?.["retry-after"];
  if (retryAfter === undefined || retryAfter === null) return null;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);

  const retryAt = Date.parse(retryAfter);
  if (!Number.isFinite(retryAt)) return null;
  return Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
}

function showToast(message) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

function getCsrfCookie() {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("csrf_token="));

  return cookie ? decodeURIComponent(cookie.slice("csrf_token=".length)) : null;
}

axiosClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  const method = config.method?.toLowerCase();
  const isWriteRequest = ["post", "put", "patch", "delete"].includes(method);

  if (isWriteRequest) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set(
      "x-csrf-token",
      getCsrfCookie() ||
        store.getState().userAuth.csrfToken ||
        selectCsrfToken(store.getState()) ||
        "",
    );
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method?.toLowerCase() || "";
    const requestPath = getRequestPath(error.config);
    const isExcludedAuthEndpoint = isAuthEndpoint(method, requestPath);

    if (status === 401 && !isExcludedAuthEndpoint) {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const returnTo = isSafeInternalPath(currentPath) ? currentPath : "/";
      if (window.location.pathname.startsWith("/admin")) {
        if (window.location.pathname !== "/admin/login") {
          window.location.assign(
            `/admin/login?returnTo=${encodeURIComponent(returnTo)}`,
          );
        }
      } else if (!["/login", "/register", "/verify-email"].includes(window.location.pathname)) {
        store.dispatch(clearCustomerSession());
        window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      }
    }

    if (status === 403) {
      const responseData = error.response?.data;
      const errors = Array.isArray(responseData?.errors) ? responseData.errors : [];
      const emailNotVerified =
        responseData?.code === "EMAIL_NOT_VERIFIED" ||
        errors.some((item) => item?.code === "EMAIL_NOT_VERIFIED");
      showToast(
        emailNotVerified
          ? "Tài khoản chưa xác thực email"
          : "Không có quyền truy cập",
      );
    }

    if (status === 429) {
      const retryAfter = getRetryAfterSeconds(error.response?.headers);
      showToast(
        retryAfter === null
          ? "Vui lòng chờ rồi thử lại"
          : `Vui lòng chờ ${retryAfter} giây rồi thử lại`,
      );
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
