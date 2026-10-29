import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getAdminCategories, getAdminProducts, deleteAdminProduct } from "../../services/adminApi.js";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const statusNames = {
  ACTIVE: "Đang kinh doanh",
  PAUSED: "Tạm ngưng",
  INACTIVE: "Ngừng kinh doanh",
};

const statusClasses = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-amber-100 text-amber-800",
  INACTIVE: "bg-slate-200 text-slate-700",
};

export default function AdminProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [reload, setReload] = useState(0);

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        getAdminProducts(Object.fromEntries(new URLSearchParams(queryString))),
        getAdminCategories({ limit: 100 }),
      ]);
      setItems(productResponse.data.data.items);
      setPagination(productResponse.data.data.pagination);
      setCategories(categoryResponse.data.data.items);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Không thể tải danh sách sản phẩm.",
      );
      setStatus("error");
    }
  }, [queryString]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, reload]);

  const updateQuery = (key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${product.name}"? Nếu sản phẩm đã có trong đơn hàng, hệ thống sẽ chuyển sang trạng thái ngừng kinh doanh.`,
    );
    if (!confirmed) return;

    setDeletingId(product._id);
    setErrorMessage("");
    try {
      await deleteAdminProduct(product._id);
      setReload((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Không thể xóa sản phẩm. Vui lòng thử lại.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">Quản lý kho hàng</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Sản phẩm</h1>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-4 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Tìm tên hoặc slug
          <input
            type="search"
            value={searchParams.get("search") || ""}
            placeholder="Nhập từ khóa"
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
            onChange={(event) => updateQuery("search", event.target.value)}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Danh mục
          <select
            value={searchParams.get("category") || ""}
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
            onChange={(event) => updateQuery("category", event.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Trạng thái
          <select
            value={searchParams.get("status") || ""}
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
            onChange={(event) => updateQuery("status", event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusNames).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {errorMessage && (
        <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>{errorMessage}</span>
          {status === "error" && (
            <button type="button" className="font-bold underline" onClick={loadProducts}>Thử lại</button>
          )}
        </div>
      )}

      {status === "loading" && (
        <div className="mt-6 grid gap-3" role="status">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-200" />
          ))}
          <span className="sr-only">Đang tải danh sách sản phẩm...</span>
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Chưa có sản phẩm phù hợp</h2>
          <p className="mt-2 text-sm text-slate-600">Thay đổi bộ lọc hoặc tạo sản phẩm mới.</p>
          <Link to="/admin/products/new" className="mt-4 inline-flex font-bold text-orange-700 hover:text-orange-800">
            Thêm sản phẩm đầu tiên
          </Link>
        </div>
      )}

      {status === "ready" && items.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Sản phẩm</th>
                    <th className="px-4 py-3 font-bold">Danh mục</th>
                    <th className="px-4 py-3 font-bold">Giá</th>
                    <th className="px-4 py-3 font-bold">Tồn kho</th>
                    <th className="px-4 py-3 font-bold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((product) => {
                    const category =
                      typeof product.categoryId === "object"
                        ? product.categoryId?.name
                        : categories.find((item) => item._id === product.categoryId)?.name;
                    const image =
                      product.images?.find((item) => item.isPrimary)?.url ||
                      product.images?.[0]?.url;
                    return (
                      <tr key={product._id} className="align-middle hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={image} alt="" className="h-12 w-14 rounded-lg bg-slate-100 object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{product.name}</p>
                              <p className="mt-1 text-xs text-slate-500">{product.brand} · {product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{category || "—"}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{currency.format(product.salePrice ?? product.listPrice)}</td>
                        <td className="px-4 py-3 text-slate-700">{product.stock ?? 0}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[product.status] || statusClasses.INACTIVE}`}>
                            {statusNames[product.status] || product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/products/${product._id}/edit`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-700">
                              Sửa
                            </Link>
                            <button
                              type="button"
                              disabled={deletingId === product._id}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                              onClick={() => handleDelete(product)}
                            >
                              {deletingId === product._id ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <LoaderCircle size={14} className="animate-spin" />
                                  Đang xóa...
                                </span>
                              ) : "Xóa"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>{pagination.total} sản phẩm · Trang {pagination.page} / {Math.max(pagination.totalPages, 1)}</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40"
                onClick={() => updateQuery("page", String(pagination.page - 1))}
              >
                Trước
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40"
                onClick={() => updateQuery("page", String(pagination.page + 1))}
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
