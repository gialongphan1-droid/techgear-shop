import { useState } from "react";
import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteCustomerCartItem,
  getCustomerCart,
  updateCustomerCartItem,
} from "../../services/publicApi.js";
import {
  setCartData,
  setCartError,
  setCartLoading,
} from "../../store/cartSlice.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price || 0);

export default function CartPage() {
  const { items, subtotal, itemCount, status, error } = useSelector(
    (state) => state.cart,
  );
  const dispatch = useDispatch();
  const [busyProductId, setBusyProductId] = useState("");

  const refreshCart = async () => {
    const response = await getCustomerCart();
    dispatch(setCartData(response.data.data));
  };

  const updateQuantity = async (item, quantity) => {
    setBusyProductId(item.productId);
    try {
      const response = await updateCustomerCartItem(item.productId, { quantity });
      dispatch(setCartData(response.data.data));
    } catch (requestError) {
      try {
        await refreshCart();
      } catch {
        dispatch(
          setCartError(
            requestError.response?.data?.message ||
              "Không thể cập nhật giỏ hàng. Vui lòng thử lại.",
          ),
        );
      }
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail:
            requestError.response?.data?.message ||
            "Không thể cập nhật giỏ hàng.",
        }),
      );
    } finally {
      setBusyProductId("");
    }
  };

  const removeItem = async (item) => {
    setBusyProductId(item.productId);
    try {
      const response = await deleteCustomerCartItem(item.productId);
      dispatch(setCartData(response.data.data));
    } catch (requestError) {
      try {
        await refreshCart();
      } catch {
        dispatch(
          setCartError(
            requestError.response?.data?.message ||
              "Không thể xóa sản phẩm khỏi giỏ hàng.",
          ),
        );
      }
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail:
            requestError.response?.data?.message ||
            "Không thể xóa sản phẩm khỏi giỏ hàng.",
        }),
      );
    } finally {
      setBusyProductId("");
    }
  };

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-4 px-4 py-12 sm:px-6 lg:px-8" role="status">
        <div className="h-10 w-48 rounded bg-slate-200" />
        <div className="h-32 rounded-2xl bg-slate-200" />
        <span className="sr-only">Đang tải giỏ hàng...</span>
      </div>
    );
  }

  if (status === "error" && !items.length) {
    return (
      <section role="alert" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-slate-950">Không thể tải giỏ hàng</h1>
        <p className="mt-2 text-slate-600">{error}</p>
        <button
          type="button"
          className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          onClick={async () => {
            dispatch(setCartLoading());
            try {
              await refreshCart();
            } catch (requestError) {
              dispatch(
                setCartError(
                  requestError.response?.data?.message ||
                    "Không thể tải giỏ hàng. Vui lòng thử lại.",
                ),
              );
            }
          }}
        >
          Thử lại
        </button>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-orange-600">
          <ShoppingBag size={30} />
        </span>
        <h1 className="mt-6 text-3xl font-black text-slate-950">Giỏ hàng đang trống</h1>
        <p className="mt-3 text-slate-600">
          Hãy khám phá các sản phẩm công nghệ và chọn món đồ phù hợp với bạn.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-flex h-11 items-center rounded-xl bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  const hasInvalidItems = items.some((item) => !item.valid);

  return (
    <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          TechGear Shop
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Giỏ hàng</h1>
        <p className="mt-2 text-sm text-slate-600">
          {items.length} sản phẩm · Tối đa 10 món cho mỗi sản phẩm
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {hasInvalidItems && (
        <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Một số sản phẩm không còn đủ điều kiện đặt mua. Hãy xóa các dòng không hợp lệ trước khi tiếp tục.
        </p>
      )}

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {items.map((item) => {
            const busy = busyProductId === item.productId;
            return (
              <article
                key={item.productId}
                className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
              >
                <Link
                  to={item.slug ? `/products/${item.slug}` : "/products"}
                  className="aspect-square overflow-hidden rounded-xl bg-slate-100"
                  aria-label={`Xem ${item.name || "sản phẩm"}`}
                >
                  {item.image && (
                    <img src={item.image} alt={item.name || ""} className="h-full w-full object-cover" />
                  )}
                </Link>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                    {item.brand}
                  </p>
                  <Link
                    to={item.slug ? `/products/${item.slug}` : "/products"}
                    className="mt-1 block font-bold leading-6 text-slate-900 hover:text-orange-700"
                  >
                    {item.name || "Sản phẩm không còn tồn tại"}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="font-black text-slate-950">
                      {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                  {!item.valid && (
                    <p className="mt-2 text-sm font-semibold text-red-700">
                      {item.invalidReason || "Sản phẩm không thể đặt mua."}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
                    <QuantityControl
                      item={item}
                      disabled={busy || !item.valid}
                      onChange={(quantity) => updateQuantity(item, quantity)}
                    />
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={`Xóa ${item.name || "sản phẩm"} khỏi giỏ hàng`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      onClick={() => removeItem(item)}
                    >
                      {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
                <div className="hidden items-center gap-5 sm:flex">
                  <QuantityControl
                    item={item}
                    disabled={busy || !item.valid}
                    onChange={(quantity) => updateQuantity(item, quantity)}
                  />
                  <div className="w-32 text-right">
                    <p className="font-black text-slate-950">{formatPrice(item.subtotal)}</p>
                    <button
                      type="button"
                      disabled={busy}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-700 disabled:opacity-50"
                      onClick={() => removeItem(item)}
                    >
                      {busy ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Tóm tắt đơn hàng</h2>
          <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
            <span>Tạm tính ({itemCount} món)</span>
            <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="font-bold text-slate-900">Tạm tính</span>
            <span className="text-xl font-black text-orange-700">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Giá chỉ mang tính tham khảo. Tổng tiền chính thức sẽ được Backend xác nhận khi đặt hàng.
          </p>
          {hasInvalidItems ? (
            <button
              type="button"
              disabled
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-300 px-5 text-sm font-bold text-white"
            >
              Xử lý sản phẩm không hợp lệ
            </button>
          ) : (
            <Link
              to="/checkout"
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700"
            >
              Tiến hành đặt hàng
            </Link>
          )}
          <Link
            to="/products"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </section>
  );
}

function QuantityControl({ item, disabled, onChange }) {
  return (
    <div
      className="inline-flex h-9 items-center rounded-lg border border-slate-200"
      aria-label={`Số lượng ${item.quantity}`}
    >
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={disabled || item.quantity <= 1}
        className="grid h-8 w-8 place-items-center rounded-l-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(item.quantity - 1)}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-bold text-slate-900">
        {item.quantity}
      </span>
      <button
        type="button"
        aria-label="Tăng số lượng"
        disabled={disabled || item.quantity >= 10}
        className="grid h-8 w-8 place-items-center rounded-r-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(item.quantity + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
