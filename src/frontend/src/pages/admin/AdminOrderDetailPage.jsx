import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ArrowLeft, PackageCheck, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { getAdminOrder, updateAdminOrderStatus } from "../../services/adminApi.js";
import { StatusBadge } from "./AdminOrderListPage.jsx";

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

const transitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "COMPLETED", "CANCELLED"],
  SHIPPED: ["COMPLETED", "RETURNED"],
  COMPLETED: [],
  CANCELLED: [],
  RETURNED: [],
};

const transitionImpacts = {
  CONFIRMED: "Xác nhận đơn. Tồn kho không thay đổi.",
  PROCESSING: "Chuyển đơn sang chuẩn bị hàng. Tồn kho không thay đổi.",
  SHIPPED: "Đánh dấu đã bàn giao vận chuyển. Sản phẩm được bỏ khỏi số lượng đang giữ.",
  COMPLETED: "Đánh dấu giao hàng hoàn tất. Sản phẩm được bỏ khỏi số lượng đang giữ.",
  CANCELLED: "Hủy đơn và hoàn lại số lượng sản phẩm vào tồn khả dụng.",
  RETURNED: "Ghi nhận hàng đã hoàn về và hoàn số lượng vào tồn khả dụng.",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [targetStatus, setTargetStatus] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { reason: "", note: "" } });

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setLoadError("");
    getAdminOrder(id)
      .then((response) => {
        if (!active) return;
        const { order: loadedOrder, history } = response.data.data;
        setOrder({ ...loadedOrder, history: history || [] });
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 404) {
          setStatus("not-found");
        } else {
          setLoadError(
            error.response?.data?.message || "Không thể tải chi tiết đơn hàng.",
          );
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const availableTransitions = order ? transitions[order.status] || [] : [];

  const openTransition = (nextStatus) => {
    setTargetStatus(nextStatus);
    setUpdateError("");
    reset({ reason: "", note: "" });
  };

  const closeTransition = () => {
    if (isSubmitting) return;
    setTargetStatus("");
    setUpdateError("");
  };

  const onSubmitTransition = async (values) => {
    setIsSubmitting(true);
    setUpdateError("");
    try {
      await updateAdminOrderStatus(order._id || order.id, {
        status: targetStatus,
        currentStatus: order.status,
        reason: values.reason,
        note: values.note,
      });
      setOrder((current) => ({ ...current, status: targetStatus }));
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: `Đã cập nhật trạng thái đơn thành "${statusNames[targetStatus]}".`,
        }),
      );
      setTargetStatus("");
      try {
        const refreshed = await getAdminOrder(order._id || order.id);
        const { order: updatedOrder, history } = refreshed.data.data;
        setOrder({ ...updatedOrder, history: history || [] });
      } catch (refreshError) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail:
              refreshError.response?.data?.message ||
              "Trạng thái đã lưu nhưng không thể tải lại lịch sử đơn hàng.",
          }),
        );
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setUpdateError(
          "Trạng thái đơn hàng đã được thay đổi bởi người khác. Thông tin mới nhất đã được tải lại.",
        );
        try {
          const refreshed = await getAdminOrder(order._id || order.id);
          const { order: latestOrder, history } = refreshed.data.data;
          setOrder({ ...latestOrder, history: history || [] });
        } catch (refreshError) {
          setUpdateError(
            refreshError.response?.data?.message ||
              "Trạng thái đã thay đổi nhưng không thể tải lại đơn hàng. Vui lòng tải lại trang.",
          );
        }
      } else {
        setUpdateError(
          error.response?.data?.message || "Không thể cập nhật trạng thái.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-4" role="status">
        <div className="h-10 w-48 rounded bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200" />
        <span className="sr-only">Đang tải chi tiết đơn hàng...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-xl font-black">Không thể tải đơn hàng</h1>
        <p className="mt-2 text-sm">{loadError}</p>
        <button type="button" className="mt-4 font-bold underline" onClick={() => window.location.reload()}>
          Thử tải lại
        </button>
      </section>
    );
  }

  if (status === "not-found" || !order) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h1 className="text-xl font-black text-slate-950">Không tìm thấy đơn hàng</h1>
        <p className="mt-2 text-sm text-slate-600">Đơn hàng này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/admin/orders" className="mt-5 inline-flex font-bold text-orange-700 hover:text-orange-800">
          Quay lại danh sách đơn hàng
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-700">
        <ArrowLeft size={16} /> Danh sách đơn hàng
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">Chi tiết đơn hàng</p>
          <h1 className="mt-2 font-mono text-2xl font-black text-slate-950 sm:text-3xl">{order.orderCode}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ngày tạo: {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeStyle: "short" }).format(new Date(order.createdAt))}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
              <PackageCheck size={20} className="text-orange-600" /> Sản phẩm
            </h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <li key={`${item.productId || item.sku || item.name}-${index}`} className="flex gap-4 py-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
                    {item.sku || "SP"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Số lượng: {item.quantity}</p>
                    <p className="mt-2 text-sm text-slate-600">Đơn giá: {currency.format(item.unitPrice ?? item.price)}</p>
                  </div>
                  <p className="shrink-0 text-right font-bold text-slate-900">
                    {currency.format(item.subtotal ?? (item.unitPrice ?? item.price) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-4">
              <span className="font-bold text-slate-900">Tổng tiền</span>
              <span className="text-xl font-black text-orange-700">{currency.format(order.totalAmount ?? order.total)}</span>
            </div>
            <p className="mt-2 text-right text-xs text-slate-500">Phí vận chuyển: {currency.format(order.shippingFee || 0)}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-black text-slate-950">Lịch sử trạng thái</h2>
            {order.history?.length ? (
              <ol className="mt-4 space-y-4">
                {[...order.history].reverse().map((entry, index) => (
                  <li key={`${entry.createdAt}-${index}`} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {entry.fromStatus
                            ? `${statusNames[entry.fromStatus]} → ${statusNames[entry.toStatus]}`
                            : statusNames[entry.toStatus]}
                        </p>
                        <time className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.createdAt))}
                        </time>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{entry.actor}</p>
                      {entry.reason && <p className="mt-1 text-sm text-slate-700">Lý do: {entry.reason}</p>}
                      {entry.note && <p className="mt-1 text-sm text-slate-600">Ghi chú: {entry.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Chưa có lịch sử trạng thái.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-black text-slate-950">
              <UserRound size={19} className="text-orange-600" /> Người nhận
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Họ tên</dt>
                <dd className="mt-1 font-semibold text-slate-900">{order.customerInfo.fullName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Số điện thoại</dt>
                <dd className="mt-1 font-semibold text-slate-900">{order.customerInfo.phone}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Địa chỉ</dt>
                <dd className="mt-1 leading-6 text-slate-900">{order.customerInfo.address}</dd>
              </div>
              {order.customerInfo.note && (
                <div>
                  <dt className="text-slate-500">Ghi chú</dt>
                  <dd className="mt-1 leading-6 text-slate-900">{order.customerInfo.note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-black text-slate-950">Cập nhật trạng thái</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Chỉ các bước tiếp theo hợp lệ theo quy trình được hiển thị.
            </p>
            {availableTransitions.length ? (
              <div className="mt-4 grid gap-2">
                {availableTransitions.map((nextStatus) => (
                  <button
                    key={nextStatus}
                    type="button"
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                      nextStatus === "CANCELLED" || nextStatus === "RETURNED"
                        ? "border-red-200 text-red-700 hover:bg-red-50"
                        : "border-slate-200 text-slate-800 hover:border-orange-200 hover:bg-orange-50"
                    }`}
                    onClick={() => openTransition(nextStatus)}
                  >
                    Chuyển thành: {statusNames[nextStatus]}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Đây là trạng thái cuối; không có bước chuyển tiếp.
              </p>
            )}
          </section>
        </div>
      </div>

      {targetStatus && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="order-status-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="order-status-title" className="text-xl font-black text-slate-950">
              Xác nhận chuyển trạng thái
            </h2>
            <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              {transitionImpacts[targetStatus]}
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmitTransition)} noValidate>
              {["CANCELLED", "RETURNED"].includes(targetStatus) && (
                <label className="block text-sm font-semibold text-slate-700">
                  Lý do * <span className="font-normal text-slate-500">(bắt buộc)</span>
                  <textarea
                    rows={3}
                    maxLength={500}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    {...register("reason", {
                      required: "Vui lòng nhập lý do.",
                      maxLength: { value: 500, message: "Lý do không vượt quá 500 ký tự." },
                    })}
                  />
                  {errors.reason && <FieldError>{errors.reason.message}</FieldError>}
                </label>
              )}
              {targetStatus !== "CANCELLED" && targetStatus !== "RETURNED" && (
                <label className="block text-sm font-semibold text-slate-700">
                  Ghi chú (không bắt buộc)
                  <textarea
                    rows={3}
                    maxLength={500}
                    className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    {...register("note", { maxLength: 500 })}
                  />
                </label>
              )}
              {updateError && <p role="alert" className="text-sm text-red-700">{updateError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" disabled={isSubmitting} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50" onClick={closeTransition}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50">
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle size={16} className="animate-spin" />
                      Đang cập nhật...
                    </span>
                  ) : "Xác nhận"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
