import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import RequireCustomerAuth from "./components/auth/RequireCustomerAuth.jsx";
import CustomerLayout from "./components/layout/CustomerLayout.jsx";
import Button from "./components/ui/Button.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import ProductDetailPage from "./pages/customer/ProductDetailPage.jsx";
import ProductListPage from "./pages/customer/ProductListPage.jsx";

const AdminLayout = lazy(() => import("./components/layout/AdminLayout.jsx"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage.jsx"));
const AdminBannerListPage = lazy(() => import("./pages/admin/AdminBannerListPage.jsx"));
const AdminCategoryListPage = lazy(() => import("./pages/admin/AdminCategoryListPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage.jsx"));
const AdminProductFormPage = lazy(() => import("./pages/admin/AdminProductFormPage.jsx"));
const AdminProductListPage = lazy(() => import("./pages/admin/AdminProductListPage.jsx"));
const AdminInventoryPage = lazy(() => import("./pages/admin/AdminInventoryPage.jsx"));
const AdminOrderDetailPage = lazy(() => import("./pages/admin/AdminOrderDetailPage.jsx"));
const AdminOrderListPage = lazy(() => import("./pages/admin/AdminOrderListPage.jsx"));
const CartPage = lazy(() => import("./pages/customer/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/customer/CheckoutPage.jsx"));
const LoginPage = lazy(() => import("./pages/customer/LoginPage.jsx"));
const MyOrdersPage = lazy(() => import("./pages/customer/MyOrdersPage.jsx"));
const OrderSuccessPage = lazy(() => import("./pages/customer/OrderSuccessPage.jsx"));
const OrderTrackingPage = lazy(() => import("./pages/customer/OrderTrackingPage.jsx"));
const ComparePage = lazy(() => import("./pages/customer/ComparePage.jsx"));
const RegisterPage = lazy(() => import("./pages/customer/RegisterPage.jsx"));
const VerifyEmailPage = lazy(() => import("./pages/customer/VerifyEmailPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function ApiNotice({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 shadow-lg sm:left-auto sm:right-6"
    >
      <span>{message}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 hover:bg-amber-100"
        onClick={onDismiss}
      >
        Đóng
      </Button>
    </div>
  );
}

function RouteFallback() {
  return (
    <div
      className="grid min-h-[50vh] place-items-center px-4 text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        Đang tải trang...
      </span>
    </div>
  );
}

export default function App() {
  const [apiNotice, setApiNotice] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const showRateLimitNotice = (event) => {
      setApiNotice(event.detail);
    };
    const showForbiddenNotice = (event) => {
      setApiNotice(event.detail);
    };
    const showToast = (event) => {
      setToast(event.detail);
      window.setTimeout(() => setToast(""), 3000);
    };

    window.addEventListener("api:rate-limit", showRateLimitNotice);
    window.addEventListener("api:forbidden", showForbiddenNotice);
    window.addEventListener("app:toast", showToast);
    return () => {
      window.removeEventListener("api:rate-limit", showRateLimitNotice);
      window.removeEventListener("api:forbidden", showForbiddenNotice);
      window.removeEventListener("app:toast", showToast);
    };
  }, []);

  return (
    <ErrorBoundary>
      <>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<CustomerLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route element={<RequireCustomerAuth />}>
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
              </Route>
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="track-order" element={<OrderTrackingPage />} />
              <Route path="compare" element={<ComparePage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductListPage />} />
              <Route path="products/new" element={<AdminProductFormPage />} />
              <Route path="products/:id/edit" element={<AdminProductFormPage />} />
              <Route path="categories" element={<AdminCategoryListPage />} />
              <Route path="banners" element={<AdminBannerListPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="orders" element={<AdminOrderListPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <ApiNotice message={apiNotice} onDismiss={() => setApiNotice("")} />
        {toast && (
          <div
            role="status"
            className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg sm:left-auto sm:right-6"
          >
            {toast}
          </div>
        )}
      </>
    </ErrorBoundary>
  );
}
