import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardList, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getCustomerOrders } from "../../services/publicApi.js";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const imagePlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f1f5f9'/%3E%3Cpath d='M18 57l15-17 10 11 8-8 12 14H18z' fill='%23cbd5e1'/%3E%3Ccircle cx='29' cy='28' r='6' fill='%23cbd5e1'/%3E%3C/svg%3E";

const statusNames = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RETURNED: "Đã hoàn hàng",
};

const statusClasses = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-800",
  PROCESSING: "border-indigo-200 bg-indigo-50 text-indigo-800",
  SHIPPED: "border-violet-200 bg-violet-50 text-violet-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-red-200 bg-red-50 text-red-800",
  RETURNED: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [requestState, setRequestState] = useState({
    status: "loading",
    error: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!selectedOrder) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedOrder(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedOrder]);

  useEffect(() => {
    let active = true;
    setRequestState({ status: "loading", error: "" });

    getCustomerOrders({ page, limit: 10 })
      .then((response) => {
        if (!active) return;
        const data = response.data.data;
        if (import.meta.env.DEV) {
          (data.items || []).forEach((order) => {
            console.log("Dữ liệu previewItems:", order.previewItems);
          });
        }
        setOrders(data.items || []);
        setPagination(
          data.pagination || {
            page,
            limit: 10,
            total: (data.items || []).length,
            totalPages: data.items?.length ? 1 : 0,
          },
        );
        setRequestState({ status: "ready", error: "" });
      })
      .catch((error) => {
        if (!active) return;
        setRequestState({
          status: "error",
          error:
            error.response?.data?.message ||
            "Không thể tải lịch sử đơn hàng. Vui lòng thử lại.",
        });
      });

    return () => {
      active = false;
    };
  }, [page, retry]);

  const changePage = (nextPage) => {
    setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});
    setSelectedOrder(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Tài khoản của bạn
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            Đơn hàng của tôi
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Theo dõi trạng thái các đơn hàng đã đặt.
          </p>
        </div>
        {requestState.status === "ready" && orders.length > 0 && (
          <p className="text-sm text-slate-500">
            {pagination.total} đơn hàng
          </p>
        )}
      </div>

      {requestState.status === "loading" && (
        <div className="mt-8 space-y-3" role="status" aria-label="Đang tải đơn hàng">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="animate-pulse border border-slate-200 bg-white p-5"
            >
              <div className="h-4 w-36 rounded bg-slate-200" />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
              </div>
            </div>
          ))}
          <span className="sr-only">Đang tải lịch sử đơn hàng...</span>
        </div>
      )}

      {requestState.status === "error" && (
        <div role="alert" className="mt-8 border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p>{requestState.error}</p>
          <button
            type="button"
            className="mt-3 font-semibold underline underline-offset-2"
            onClick={() => setRetry((value) => value + 1)}
          >
            Thử tải lại
          </button>
        </div>
      )}

      {requestState.status === "ready" && orders.length === 0 && (
        <div className="mt-8 border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <ClipboardList size={34} className="mx-auto text-slate-400" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Những đơn hàng bạn đặt sẽ xuất hiện tại đây.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Mua sắm ngay
          </Link>
        </div>
      )}

      {requestState.status === "ready" && orders.length > 0 && (
        <>
          <div className="mt-8 space-y-3">
            {orders.map((order) => (
              <article
                key={order.orderCode}
                className="border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-soft sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <PreviewItems order={order} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Mã đơn hàng
                        </p>
                        <p className="mt-1 font-mono text-base font-semibold text-ink">
                          {order.orderCode}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs text-slate-500">Ngày đặt</dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {formatDate(order.createdAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Tổng tiền</dt>
                        <dd className="mt-1 text-sm font-semibold text-ink">
                          {currency.format(order.totalAmount || 0)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Sản phẩm</dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">
                          {order.itemCount || 0} sản phẩm
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-5 border-t border-slate-100 pt-4 sm:flex sm:justify-end">
                      <button
                        type="button"
                        className="text-sm font-semibold text-brand-700 underline-offset-4 transition hover:text-brand-800 hover:underline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <p>
              Trang {pagination.page} / {Math.max(1, pagination.totalPages)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-3 font-medium transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => changePage(page - 1)}
              >
                <ArrowLeft size={16} /> Trước
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                className="inline-flex h-10 items-center gap-2 border border-slate-200 bg-white px-3 font-medium transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => changePage(page + 1)}
              >
                Sau <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-order-detail-title"
            className="my-auto w-full max-w-lg border border-slate-200 bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  Chi tiết đơn hàng
                </p>
                <h2 id="customer-order-detail-title" className="mt-2 font-mono text-xl font-semibold text-ink">
                  {selectedOrder.orderCode}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Đóng chi tiết"
                className="grid h-9 w-9 shrink-0 place-items-center text-slate-500 transition hover:bg-slate-100 hover:text-ink"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={19} />
              </button>
            </div>
            <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
              <DetailRow label="Ngày đặt" value={formatDate(selectedOrder.createdAt)} />
              <DetailRow
                label="Trạng thái"
                value={<StatusBadge status={selectedOrder.status} />}
              />
              <DetailRow
                label="Số lượng sản phẩm"
                value={`${selectedOrder.itemCount || 0} sản phẩm`}
              />
              <DetailRow
                label="Tổng tiền"
                value={currency.format(selectedOrder.totalAmount || 0)}
              />
            </dl>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Thông tin chi tiết sản phẩm trong đơn không được cung cấp từ API lịch sử hiện tại.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}

function PreviewItems({ order }) {
  const previewItems = Array.isArray(order.previewItems)
    ? order.previewItems.slice(0, 3)
    : [];
  const remainingCount = Math.max(
    0,
    Number(order.itemCount || 0) - previewItems.length,
  );

  if (!previewItems.length) return null;

  return (
    <div className="flex shrink-0 items-center gap-3 sm:w-56 sm:items-start sm:pt-1">
      <div className="flex -space-x-2">
        {previewItems.map((item, index) => {
          const name = item.name || item.productName || "Sản phẩm";
          const itemImage =
            typeof item.image === "string" ? item.image : item.image?.url;
          const image =
            itemImage ||
            item.imageUrl ||
            item.thumbnail ||
            item.images?.find?.((entry) => entry.isPrimary)?.url ||
            item.images?.[0]?.url ||
            imagePlaceholder;

          return (
            <img
              key={item.productId || item._id || `${name}-${index}`}
              src={image}
              alt={name}
              title={name}
              loading="lazy"
              className="block h-14 w-14 shrink-0 rounded-md border-2 border-white bg-slate-100 object-cover shadow-sm transition duration-200 hover:z-10 hover:scale-105 sm:h-16 sm:w-16"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = imagePlaceholder;
              }}
            />
          );
        })}
      </div>
      {remainingCount > 0 && (
        <span className="text-xs font-medium leading-5 text-slate-500">
          + {remainingCount} sản phẩm khác
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold ${
        statusClasses[status] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {statusNames[status] || status}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTime.format(date);
}
