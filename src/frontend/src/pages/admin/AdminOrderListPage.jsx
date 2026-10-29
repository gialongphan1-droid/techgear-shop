import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAdminOrders } from "../../services/adminApi.js";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

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
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-violet-100 text-violet-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURNED: "bg-slate-200 text-slate-700",
};
const statuses = Object.keys(statusNames);

export default function AdminOrderListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page, limit: 10, total: 0, totalPages: 1 });
  const [requestState, setRequestState] = useState({ status: "loading", error: "" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setRequestState({ status: "loading", error: "" });
    getAdminOrders({ page, limit: 10, search, status: statusFilter || undefined })
      .then((response) => {
        if (!active) return;
        const data = response.data.data;
        setOrders(data.items || []);
        setPagination(data.pagination || { page, limit: 10, total: (data.items || []).length, totalPages: 1 });
        setRequestState({ status: "ready", error: "" });
      })
      .catch((error) => {
        if (!active) return;
        setRequestState({
          status: "error",
          error: error.response?.data?.message || "Không thể tải danh sách đơn hàng.",
        });
      });
    return () => {
      active = false;
    };
  }, [page, search, statusFilter, retry]);

  const updateFilter = (key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  };

  const changePage = (nextPage) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextPage > 1) next.set("page", String(nextPage));
      else next.delete("page");
      return next;
    });
  };

  return (
    <section>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Quản lý bán hàng
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Đơn hàng</h1>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Tìm mã đơn hàng
          <input
            type="search"
            value={search}
            placeholder="Ví dụ: TG-2601-1001"
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
            onChange={(event) => updateFilter("search", event.target.value)}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Trạng thái
          <select
            value={statusFilter}
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{statusNames[status]}</option>
            ))}
          </select>
        </label>
      </div>

      {requestState.status === "loading" && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-600" role="status">
          <LoaderCircle size={18} className="animate-spin" /> Đang tải đơn hàng...
        </div>
      )}
      {requestState.status === "error" && (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p>{requestState.error}</p>
          <button type="button" className="mt-3 font-bold underline" onClick={() => setRetry((value) => value + 1)}>
            Thử lại
          </button>
        </div>
      )}
      {requestState.status === "ready" && !orders.length && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Không có đơn hàng phù hợp</h2>
          <p className="mt-2 text-sm text-slate-600">Thay đổi bộ lọc hoặc xóa nội dung tìm kiếm.</p>
        </div>
      )}
      {requestState.status === "ready" && orders.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Mã đơn</th>
                    <th className="px-4 py-3 font-bold">Khách hàng</th>
                    <th className="px-4 py-3 font-bold">Số điện thoại</th>
                    <th className="px-4 py-3 font-bold">Tổng tiền</th>
                    <th className="px-4 py-3 font-bold">Trạng thái</th>
                    <th className="px-4 py-3 font-bold">Ngày tạo</th>
                    <th className="px-4 py-3 text-right font-bold">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const id = order._id || order.id;
                    return (
                      <tr key={id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-4 font-mono font-bold text-slate-900">{order.orderCode}</td>
                        <td className="px-4 py-4 font-semibold text-slate-800">{order.customerInfo?.fullName || "—"}</td>
                        <td className="px-4 py-4 text-slate-600">{order.customerInfo?.phone || "—"}</td>
                        <td className="px-4 py-4 font-bold text-slate-900">{currency.format(order.totalAmount || 0)}</td>
                        <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-4 py-4 text-slate-600">
                          {order.createdAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt)) : "—"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link to={`/admin/orders/${id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-700">
                            Xem đơn
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>{pagination.total} đơn hàng · Trang {pagination.page} / {Math.max(1, pagination.totalPages)}</p>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40" onClick={() => changePage(page - 1)}>
                Trước
              </button>
              <button type="button" disabled={page >= pagination.totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40" onClick={() => changePage(page + 1)}>
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[status] || "bg-slate-100 text-slate-700"}`}>
      {statusNames[status] || status}
    </span>
  );
}
