import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import RequireCustomerAuth from "./components/auth/RequireCustomerAuth.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import CustomerLayout from "./components/layout/CustomerLayout.jsx";
import Button from "./components/ui/Button.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminBannerListPage from "./pages/admin/AdminBannerListPage.jsx";
import AdminCategoryListPage from "./pages/admin/AdminCategoryListPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage.jsx";
import AdminProductListPage from "./pages/admin/AdminProductListPage.jsx";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage.jsx";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage.jsx";
import AdminOrderListPage from "./pages/admin/AdminOrderListPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import CheckoutPage from "./pages/customer/CheckoutPage.jsx";
import HomePage from "./pages/customer/HomePage.jsx";
import LoginPage from "./pages/customer/LoginPage.jsx";
import OrderSuccessPage from "./pages/customer/OrderSuccessPage.jsx";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage.jsx";
import ComparePage from "./pages/customer/ComparePage.jsx";
import RegisterPage from "./pages/customer/RegisterPage.jsx";
import VerifyEmailPage from "./pages/customer/VerifyEmailPage.jsx";
import ProductDetailPage from "./pages/customer/ProductDetailPage.jsx";
import ProductListPage from "./pages/customer/ProductListPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
