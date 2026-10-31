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
    const requestUrl = error.config?.url || "";
    const isCustomerAuthRequest = /^\/auth\/(login|register|verify-email)(\?|$)/.test(
      requestUrl,
    );

    if (status === 401 && !error.config?.skipAuthRedirect && !isCustomerAuthRequest) {
      if (window.location.pathname.startsWith("/admin")) {
        if (window.location.pathname !== "/admin/login") {
          const returnTo = encodeURIComponent(
            `${window.location.pathname}${window.location.search}`,
          );
          window.location.assign(`/admin/login?returnTo=${returnTo}`);
        }
      } else if (!["/login", "/register", "/verify-email"].includes(window.location.pathname)) {
        store.dispatch(clearCustomerSession());
        const returnTo = encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        );
        window.location.assign(`/login?returnTo=${returnTo}`);
      }
    }

    if (status === 403) {
      const message = error.response?.data?.message || "";
      if (/xác thực email|chưa xác thực/i.test(message)) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: "Tài khoản chưa xác thực email",
          }),
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("api:forbidden", {
            detail: "Yêu cầu bị từ chối. Vui lòng kiểm tra phiên đăng nhập, CSRF hoặc Origin.",
          }),
        );
      }
    }

    if (status === 429) {
      window.dispatchEvent(
        new CustomEvent("api:rate-limit", {
          detail: "Quá nhiều yêu cầu, vui lòng thử lại sau",
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
