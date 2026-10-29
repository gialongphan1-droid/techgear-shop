import { useEffect, useState } from "react";
import { CheckCircle2, Clipboard, ClipboardCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order] = useState(() => location.state?.order || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (location.state?.order) {
      navigate("/order-success", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  if (!order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-2xl font-black text-slate-950">
          Không có thông tin xác nhận đơn hàng
        </h1>
        <p className="mt-3 leading-6 text-slate-600">
          Nếu bạn vừa đặt hàng nhưng chưa lưu mã tra cứu, vui lòng liên hệ cửa hàng để được hỗ trợ.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-orange-600"
        >
          Về trang chủ
        </Link>
      </section>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Mã đơn hàng: ${order.orderCode}\nMã tra cứu: ${order.trackCode}`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={36} />
          </span>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
            Đặt hàng thành công
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Cảm ơn bạn đã mua sắm!
          </h1>
          <p className="mt-3 leading-6 text-slate-600">
            Cửa hàng sẽ liên hệ để xác nhận đơn hàng. Đơn hiện đang ở trạng thái chờ xử lý.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-slate-600">Mã đơn hàng</span>
            <strong className="font-mono text-lg font-black text-slate-950">{order.orderCode}</strong>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-slate-600">Mã tra cứu</span>
            <strong className="font-mono text-lg font-black tracking-wider text-orange-700">{order.trackCode}</strong>
          </div>
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
            Vui lòng lưu lại mã tra cứu, mã này chỉ hiển thị một lần.
          </p>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
            onClick={handleCopy}
          >
            {copied ? <ClipboardCheck size={17} /> : <Clipboard size={17} />}
            {copied ? "Đã sao chép mã" : "Sao chép mã đơn và mã tra cứu"}
          </button>
          {!copied && (
            <p className="text-xs text-slate-500">
              Nếu sao chép không khả dụng, hãy ghi lại hai mã ở trên.
            </p>
          )}
        </div>

        <div className="mt-7">
          <h2 className="font-black text-slate-950">Tóm tắt đơn hàng</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-slate-700">
                  {item.name} <span className="text-slate-500">× {item.quantity}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {formatPrice(item.subtotal ?? (item.unitPrice ?? item.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900">Tổng tạm tính</span>
            <span className="text-lg font-black text-orange-700">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/track-order"
            className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Tra cứu đơn hàng
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
}
