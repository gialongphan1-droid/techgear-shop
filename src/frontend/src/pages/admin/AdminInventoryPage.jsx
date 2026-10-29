import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { adjustAdminInventory, getAdminInventory } from "../../services/adminApi.js";

const formatNumber = new Intl.NumberFormat("vi-VN");
const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const adjustmentTypes = {
  add: "Nhập thêm",
  subtract: "Giảm tồn",
  count: "Đặt lại theo kiểm kê",
};

function normalizeInventoryItem(item) {
  return {
    ...item,
    productId: item.productId || item._id || item.id,
    availableStock: Number(item.availableStock ?? item.stock ?? 0),
    heldStock: Number(item.heldStock ?? item.heldQuantity ?? 0),
    physicalStock: Number(
      item.physicalStock ??
        Number(item.availableStock ?? item.stock ?? 0) +
          Number(item.heldStock ?? item.heldQuantity ?? 0),
    ),
  };
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { type: "add", quantity: 1, reason: "" } });
  const adjustmentType = watch("type");

  const refreshInventory = useCallback(async () => {
    const response = await getAdminInventory({ page: 1, limit: 100 });
    const data = response.data.data;
    setInventory((data.items || []).map(normalizeInventoryItem));
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setErrorMessage("");
    getAdminInventory({ page: 1, limit: 100 })
      .then((response) => {
        if (!active) return;
        const data = response.data.data;
        setInventory((data.items || []).map(normalizeInventoryItem));
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(
          error.response?.data?.message || "Không thể tải dữ liệu tồn kho.",
        );
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [retry]);

  const openAdjustment = (item) => {
    setSelectedItem(item);
    setFormError("");
    reset({ type: "add", quantity: 1, reason: "" });
  };

  const closeAdjustment = () => {
    if (isSaving) return;
    setSelectedItem(null);
    setFormError("");
  };

  const onSubmit = async (values) => {
    setIsSaving(true);
    setFormError("");
    let result;
    try {
      const payload = {
        productId: selectedItem.productId,
        type: values.type,
        quantity: Number(values.quantity),
        reason: values.reason.trim(),
        ...(values.type === "count"
          ? { currentSeenStock: selectedItem.availableStock }
          : {}),
      };
      const response = await adjustAdminInventory(payload);
      result = response.data.data;
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Không thể điều chỉnh tồn kho.",
      );
      setIsSaving(false);
      return;
    }

    const log = result.log || result.inventoryLog;
    if (log) {
      setHistory((current) => [
        {
          ...log,
          productName: selectedItem.name,
          type: result.type || values.type,
          quantity: result.quantity,
        },
        ...current,
      ]);
    }
    setSelectedItem(null);
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: `Đã ${adjustmentTypes[values.type].toLowerCase()} tồn kho cho "${selectedItem.name}".`,
      }),
    );
    try {
      await refreshInventory();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Điều chỉnh đã lưu nhưng không thể tải lại tồn kho.",
      );
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-4" role="status">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-16 rounded-xl bg-slate-200" />
        ))}
        <span className="sr-only">Đang tải tồn kho...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-xl font-black">Không thể tải tồn kho</h1>
        <p className="mt-2 text-sm">{errorMessage}</p>
        <button type="button" className="mt-4 font-bold underline" onClick={() => setRetry((value) => value + 1)}>
          Thử lại
        </button>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">Quản lý kho hàng</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Tồn kho</h1>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        Tồn khả dụng, số lượng đang giữ và tồn thực tế được đồng bộ từ hệ thống. Form sản phẩm không dùng để chỉnh sửa tồn kho.
      </p>

      <label className="mt-6 block max-w-md text-xs font-bold uppercase tracking-wide text-slate-500">
        Tìm sản phẩm
        <input
          type="search"
          value={search}
          placeholder="Nhập tên sản phẩm"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-orange-500"
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {!filteredInventory.length ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Không tìm thấy sản phẩm</h2>
          <p className="mt-2 text-sm text-slate-600">Thử từ khóa tìm kiếm khác.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">Sản phẩm</th>
                  <th className="px-4 py-3 font-bold">Tồn khả dụng</th>
                  <th className="px-4 py-3 font-bold">Đang giữ</th>
                  <th className="px-4 py-3 font-bold">Tồn thực tế</th>
                  <th className="px-4 py-3 text-right font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.brand || "—"}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatNumber.format(item.availableStock)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatNumber.format(item.heldStock)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatNumber.format(item.physicalStock)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50" onClick={() => openAdjustment(item)}>
                        Điều chỉnh
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-black text-slate-950">Biến động gần đây</h2>
        <p className="mt-1 text-sm text-slate-500">Các điều chỉnh thành công trong phiên này.</p>
        {history.length ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {history.map((entry, index) => (
              <li key={`${entry.createdAt || entry.logId}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{entry.productName}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">
                    {adjustmentTypes[entry.type?.replace("admin_", "")] || "Điều chỉnh"} · {formatNumber.format(entry.quantity)}
                  </p>
                  {entry.createdAt && (
                    <time className="mt-1 block text-xs text-slate-500">
                      {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt))}
                    </time>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Chưa có biến động tồn kho trong phiên này.</p>
        )}
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="inventory-adjust-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Điều chỉnh tồn kho</p>
            <h2 id="inventory-adjust-title" className="mt-1 text-xl font-black text-slate-950">{selectedItem.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tồn khả dụng: <strong>{selectedItem.availableStock}</strong> · Đang giữ: <strong>{selectedItem.heldStock}</strong>
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="block text-sm font-semibold text-slate-700">
                Hình thức điều chỉnh
                <select className={inputClass} {...register("type", { required: true })}>
                  <option value="add">Nhập thêm</option>
                  <option value="subtract">Giảm tồn</option>
                  <option value="count">Đặt lại theo kiểm kê</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                {adjustmentType === "count" ? "Tồn khả dụng sau kiểm kê *" : "Số lượng *"}
                <input
                  type="number"
                  min={adjustmentType === "count" ? 0 : 1}
                  max="10000"
                  step="1"
                  className={inputClass}
                  {...register("quantity", {
                    required: "Vui lòng nhập số lượng.",
                    valueAsNumber: true,
                    validate: (value) =>
                      (Number.isInteger(value) &&
                        value >= (adjustmentType === "count" ? 0 : 1) &&
                        value <= 10000) ||
                      "Số lượng phải là số nguyên hợp lệ (tối đa 10.000).",
                  })}
                />
                {errors.quantity && <FieldError>{errors.quantity.message}</FieldError>}
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Lý do * (bắt buộc)
                <textarea
                  rows={3}
                  maxLength={500}
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  {...register("reason", {
                    required: "Vui lòng nhập lý do điều chỉnh.",
                    minLength: { value: 2, message: "Lý do cần ít nhất 2 ký tự." },
                    maxLength: { value: 500, message: "Lý do không vượt quá 500 ký tự." },
                  })}
                />
                {errors.reason && <FieldError>{errors.reason.message}</FieldError>}
              </label>
              {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" disabled={isSaving} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50" onClick={closeAdjustment}>Hủy</button>
                <button type="submit" disabled={isSaving} className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50">
                  {isSaving ? <span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" />Đang cập nhật...</span> : "Xác nhận điều chỉnh"}
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
