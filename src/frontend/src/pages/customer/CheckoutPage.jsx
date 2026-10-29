import { useRef, useState } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  createCustomerOrder,
  getCustomerCart,
} from "../../services/publicApi.js";
import { clearCart, setCartData } from "../../store/cartSlice.js";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal } = useSelector((state) => state.cart);
  const idempotencyKey = useRef(null);
  const orderSubmitted = useRef(false);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { fullName: "", phone: "", address: "", note: "" },
  });
  const phoneField = register("phone", {
    required: "Vui lòng nhập số điện thoại.",
    pattern: {
      value: /^0\d{9}$/,
      message: "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số.",
    },
  });
  if ((!items.length || items.some((item) => !item.valid)) && !orderSubmitted.current) {
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = async (values) => {
    setSubmitError("");
    idempotencyKey.current ||= window.crypto.randomUUID();

    try {
      const response = await createCustomerOrder({
        customerInfo: {
          fullName: values.fullName.trim(),
          phone: values.phone,
          address: values.address.trim(),
          note: values.note.trim(),
        },
        idempotencyKey: idempotencyKey.current,
        clientTotal: subtotal,
      });
      const result = response.data.data;
      const order = {
        ...result.order,
        trackCode: result.trackCode,
        total: result.order.totalAmount,
        items: result.order.items.map((item, index) => ({
          ...item,
          productId: `${result.order.orderCode}-${index}`,
        })),
      };
      orderSubmitted.current = true;
      dispatch(clearCart());
      navigate("/order-success", { replace: true, state: { order } });
    } catch (error) {
      const serverMessage = error.response?.data?.message || "";
      const fieldErrors = error.response?.data?.errors || [];
      if (
        error.response?.status === 422 &&
        (fieldErrors.some((item) => item.field === "clientTotal") ||
          serverMessage.toLowerCase().includes("clienttotal"))
      ) {
        setSubmitError(
          "Giá sản phẩm đã thay đổi. Giỏ hàng đã được làm mới; vui lòng kiểm tra lại tổng tiền trước khi đặt hàng.",
        );
      } else if (
        error.response?.status === 422 &&
        (serverMessage.toLowerCase().includes("tồn kho") ||
          error.response?.data?.data?.items?.length)
      ) {
        setSubmitError(
          "Tồn kho đã thay đổi hoặc không đủ số lượng. Giỏ hàng đã được làm mới; vui lòng kiểm tra lại.",
        );
      } else if (
        error.response?.status === 422 &&
        serverMessage.toLowerCase().includes("giỏ hàng trống")
      ) {
        setSubmitError("Giỏ hàng đã trống. Vui lòng chọn sản phẩm trước khi đặt hàng.");
      } else {
        setSubmitError(
          serverMessage || "Chưa thể xác nhận đơn hàng. Vui lòng thử lại.",
        );
      }

      try {
        const cartResponse = await getCustomerCart();
        dispatch(setCartData(cartResponse.data.data));
      } catch {
        // The original order error remains visible; the cart can be refreshed from its page.
      }
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Hoàn tất đơn hàng
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Thông tin nhận hàng</h1>
        <p className="mt-2 text-sm text-slate-600">
          Điền thông tin để cửa hàng liên hệ xác nhận đơn hàng.
        </p>
      </div>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="block text-sm font-semibold text-slate-700">
            Họ và tên *
            <input
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              className={inputClass}
              {...register("fullName", {
                required: "Vui lòng nhập họ và tên.",
                minLength: { value: 2, message: "Họ tên cần ít nhất 2 ký tự." },
                maxLength: { value: 100, message: "Họ tên không vượt quá 100 ký tự." },
                validate: (value) =>
                  !/[<>]/.test(value) || "Họ tên không được chứa HTML.",
              })}
            />
            {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Số điện thoại *
            <input
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              aria-invalid={Boolean(errors.phone)}
              className={inputClass}
              {...phoneField}
              onChange={(event) => {
                event.currentTarget.value = event.currentTarget.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
                phoneField.onChange(event);
              }}
            />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Địa chỉ nhận hàng *
            <textarea
              autoComplete="street-address"
              rows={3}
              aria-invalid={Boolean(errors.address)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              {...register("address", {
                required: "Vui lòng nhập địa chỉ nhận hàng.",
                minLength: { value: 5, message: "Địa chỉ cần ít nhất 5 ký tự." },
                maxLength: { value: 300, message: "Địa chỉ không vượt quá 300 ký tự." },
                validate: (value) =>
                  !/[<>]/.test(value) || "Địa chỉ không được chứa HTML.",
              })}
            />
            {errors.address && <FieldError>{errors.address.message}</FieldError>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Ghi chú
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Lưu ý khi giao hàng (không bắt buộc)"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              {...register("note", {
                maxLength: { value: 500, message: "Ghi chú không vượt quá 500 ký tự." },
              })}
            />
            {errors.note && <FieldError>{errors.note.message}</FieldError>}
          </label>

          <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
            TechGear Shop chưa hỗ trợ thanh toán trực tuyến. Cửa hàng sẽ liên hệ để xác nhận đơn và thông báo cách thu tiền, phí vận chuyển (nếu có).
          </p>
          {submitError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {submitError}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="inline-flex h-12 items-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Quay lại giỏ hàng
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác nhận đặt hàng"
              )}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Đơn hàng của bạn</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold leading-5 text-slate-800">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Số lượng: {item.quantity}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {formatPrice(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
            <span>Phí vận chuyển</span>
            <span>0 ₫*</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-slate-900">Tạm tính</span>
            <span className="text-xl font-black text-orange-700">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            * Phí vận chuyển sẽ được cửa hàng xác nhận khi liên hệ.
          </p>
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-700" />
            Thông tin chỉ dùng để tiếp nhận và xác nhận đơn hàng.
          </p>
        </aside>
      </div>
    </section>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
