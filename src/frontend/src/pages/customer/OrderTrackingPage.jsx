import { useState } from "react";
import { LoaderCircle, SearchCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { trackCustomerOrder } from "../../services/publicApi.js";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-mono text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

const statusNames = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RETURNED: "Đã hoàn hàng",
};

export default function OrderTrackingPage() {
  const [status, setStatus] = useState("idle");
  const [order, setOrder] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { orderCode: "", trackCode: "" } });

  const onSubmit = async (values) => {
    setLookupError("");
    setOrder(null);
    setStatus("loading");
    try {
      const response = await trackCustomerOrder({
        orderCode: values.orderCode.trim(),
        trackCode: values.trackCode.trim(),
      });
      setOrder(response.data.data.order);
      setStatus("found");
    } catch (error) {
      if (error.response?.status === 404) {
      setLookupError(
          "Không tìm thấy đơn hàng phù hợp. Vui lòng kiểm tra lại mã đơn hàng và mã tra cứu.",
        );
      } else {
        setLookupError(
          error.response?.data?.message ||
            "Không thể tra cứu đơn hàng. Vui lòng thử lại sau.",
      );
      }
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-600">
          <SearchCheck size={28} />
        </span>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Hỗ trợ đơn hàng
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Tra cứu đơn hàng</h1>
        <p className="mt-3 leading-6 text-slate-600">
          Nhập mã đơn hàng và mã tra cứu được cung cấp sau khi đặt hàng.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="block text-sm font-semibold text-slate-700">
            Mã đơn hàng
            <input
              autoComplete="off"
              placeholder="Ví dụ: TG-123456"
              aria-invalid={Boolean(errors.orderCode)}
              className={inputClass}
              {...register("orderCode", {
                required: "Vui lòng nhập mã đơn hàng.",
                maxLength: { value: 50, message: "Mã đơn hàng không hợp lệ." },
              })}
            />
            {errors.orderCode && <FieldError>{errors.orderCode.message}</FieldError>}
          </label>
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Mã tra cứu
            <input
              autoComplete="off"
              placeholder="Nhập mã tra cứu"
              aria-invalid={Boolean(errors.trackCode)}
              className={inputClass}
              {...register("trackCode", {
                required: "Vui lòng nhập mã tra cứu.",
                maxLength: { value: 100, message: "Mã tra cứu không hợp lệ." },
              })}
            />
            {errors.trackCode && <FieldError>{errors.trackCode.message}</FieldError>}
          </label>

          {lookupError && (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
              {lookupError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Đang tra cứu...
              </>
            ) : (
              "Tra cứu"
            )}
          </button>
          <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-slate-500 hover:text-orange-700">
            ← Quay về trang chủ
          </Link>
        </form>

        {status === "found" && order && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Đơn hàng</p>
                <h2 className="mt-1 font-mono text-xl font-black text-slate-950">{order.orderCode}</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                {statusNames[order.status] || order.status}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Ngày đặt:{" "}
              <strong className="font-semibold text-slate-900">
                {new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(order.createdAt))}
              </strong>
            </p>
            <ul className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
              {order.items.map((item, index) => (
                <li key={`${item.sku || item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-slate-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-semibold text-slate-900">
                    {formatPrice(item.subtotal ?? item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <span className="font-bold text-slate-900">Tổng tạm tính</span>
              <span className="text-lg font-black text-orange-700">{formatPrice(order.totalAmount)}</span>
            </div>
            <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
              Cửa hàng sẽ liên hệ với bạn để xác nhận đơn hàng.
            </p>
          </section>
        )}

        {status === "idle" && (
          <aside className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
            Kết quả tra cứu sẽ hiển thị tại đây sau khi bạn gửi thông tin.
          </aside>
        )}
      </div>
    </section>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
