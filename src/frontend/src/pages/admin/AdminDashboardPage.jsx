import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../services/adminApi.js";

const cards = [
  {
    key: "totalProducts",
    label: "Tổng sản phẩm",
    href: "/admin/products",
    accent: "bg-orange-100 text-orange-700",
  },
  {
    key: "totalCategories",
    label: "Tổng danh mục",
    href: "/admin/categories",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    key: "pendingOrders",
    label: "Đơn chờ xử lý",
    href: "/admin/orders",
    accent: "bg-amber-100 text-amber-700",
  },
];

function normalizeStats(data) {
  const stats = data?.stats || data || {};
  const ordersByStatus = stats.ordersByStatus || stats.orders || {};

  return {
    totalProducts:
      stats.totalProducts ?? stats.productsCount ?? stats.productCount,
    totalCategories:
      stats.totalCategories ?? stats.categoriesCount ?? stats.categoryCount,
    pendingOrders:
      stats.pendingOrders ??
      stats.pendingOrdersCount ??
      ordersByStatus.PENDING,
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [source, setSource] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then((response) => {
        if (!active) return;
        const nextStats = normalizeStats(response.data.data);
        const hasStats = Object.values(nextStats).some(
          (value) => value !== undefined && value !== null,
        );
        if (!hasStats) {
          setErrorMessage("API Dashboard không trả về dữ liệu thống kê.");
          setSource("error");
        } else {
          setStats(nextStats);
          setSource("ready");
        }
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(
          error.response?.data?.message ||
            "Không thể tải thống kê. Vui lòng thử lại.",
        );
        setSource("error");
      });

    return () => {
      active = false;
    };
  }, [requestNumber]);

  const retry = () => {
    setStats(null);
    setErrorMessage("");
    setSource("loading");
    setRequestNumber((current) => current + 1);
  };

  return (
    <section>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Tổng quan cửa hàng
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Theo dõi nhanh tình hình hoạt động và truy cập các khu vực quản lý.
        </p>
      </div>

      {source === "loading" && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">
          {cards.map((card) => (
            <div key={card.key} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
          ))}
          <span className="sr-only">Đang tải thống kê...</span>
        </div>
      )}

      {source === "error" && (
        <div role="alert" className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p>{errorMessage}</p>
          <button type="button" className="mt-3 font-bold underline" onClick={retry}>
            Thử lại
          </button>
        </div>
      )}

      {stats && source === "ready" && (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.key}
                to={card.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-black text-slate-950">
                      {stats[card.key] ?? "—"}
                    </p>
                  </div>
                  <span className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-black ${card.accent}`}>
                    {card.key === "totalProducts"
                      ? "SP"
                      : card.key === "totalCategories"
                        ? "DM"
                        : "ĐH"}
                  </span>
                </div>
                <p className="mt-5 text-sm font-bold text-orange-700 group-hover:text-orange-800">
                  Đi đến quản lý →
                </p>
              </Link>
            ))}
          </div>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-black text-slate-950">Lối tắt quản lý</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ["Sản phẩm", "/admin/products"],
            ["Danh mục", "/admin/categories"],
            ["Banner", "/admin/banners"],
            ["Tồn kho", "/admin/inventory"],
            ["Đơn hàng", "/admin/orders"],
          ].map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
