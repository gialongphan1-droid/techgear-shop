import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { createAdminBanner, deleteAdminBanner, getAdminBanners, updateAdminBanner } from "../../services/adminApi.js";

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function notify(message) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function AdminBannerListPage() {
  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [editingBanner, setEditingBanner] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [reload, setReload] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      imageUrl: "",
      publicId: "",
      linkUrl: "",
      position: "HERO_SLIDER",
      isActive: true,
    },
  });

  const loadBanners = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await getAdminBanners({ page, limit: 20 });
      setBanners(response.data.data.items);
      setPagination(response.data.data.pagination);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Không thể tải danh sách banner."));
      setStatus("error");
    }
  }, [page]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners, reload]);

  const openCreateForm = () => {
    setEditingBanner(null);
    setFormOpen(true);
    setFormError("");
    reset({
      title: "",
      imageUrl: "",
      publicId: "",
      linkUrl: "",
      position: "HERO_SLIDER",
      isActive: true,
    });
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner);
    setFormOpen(true);
    setFormError("");
    reset({
      title: banner.title || "",
      imageUrl: banner.imageUrl || "",
      publicId: banner.publicId || "",
      linkUrl: banner.linkUrl || "",
      position: banner.position || "HERO_SLIDER",
      isActive: banner.isActive !== false,
    });
  };

  const closeForm = () => {
    if (isSubmitting) return;
    setFormOpen(false);
    setFormError("");
  };

  const onSubmit = async (values) => {
    setFormError("");
    const payload = {
      title: values.title.trim(),
      imageUrl: values.imageUrl.trim(),
      publicId: values.publicId.trim(),
      linkUrl: values.linkUrl.trim(),
      position: values.position.trim().toUpperCase(),
      isActive: Boolean(values.isActive),
    };

    try {
      if (editingBanner) {
        await updateAdminBanner(editingBanner._id, payload);
        notify("Banner đã được cập nhật.");
      } else {
        await createAdminBanner(payload);
        notify("Banner đã được tạo.");
      }
      setFormOpen(false);
      setReload((current) => current + 1);
    } catch (error) {
      const fieldErrors = error.response?.data?.errors || [];
      fieldErrors.forEach((fieldError) => {
        if (fieldError.field) {
          setError(fieldError.field, { message: fieldError.message });
        }
      });
      const message = getErrorMessage(error, "Không thể lưu banner.");
      setFormError(message);
      notify(message);
    }
  };

  const handleDelete = async (banner) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa banner "${banner.title}"? Thao tác này không thể hoàn tác.`,
      )
    ) {
      return;
    }

    setDeletingId(banner._id);
    setErrorMessage("");
    try {
      await deleteAdminBanner(banner._id);
      notify("Banner đã được xóa.");
      if (banners.length === 1 && page > 1) setPage((current) => current - 1);
      else setReload((current) => current + 1);
    } catch (error) {
      const message = getErrorMessage(error, "Không thể xóa banner.");
      setErrorMessage(message);
      notify(message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
            Quản lý cửa hàng
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            Banner
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-4 text-sm font-bold text-white transition hover:bg-orange-700"
          onClick={openCreateForm}
        >
          + Thêm banner
        </button>
      </div>

      {errorMessage && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      {status === "loading" && (
        <div className="mt-6 grid gap-3" role="status">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-200" />
          ))}
          <span className="sr-only">Đang tải banner...</span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center">
          <button type="button" className="font-bold text-orange-700 underline" onClick={() => setReload((current) => current + 1)}>
            Thử tải lại
          </button>
        </div>
      )}

      {status === "ready" && banners.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Chưa có banner</h2>
          <p className="mt-2 text-sm text-slate-600">Thêm banner để giới thiệu nội dung nổi bật tại trang chủ.</p>
          <button type="button" className="mt-4 font-bold text-orange-700 hover:text-orange-800" onClick={openCreateForm}>
            Tạo banner đầu tiên
          </button>
        </div>
      )}

      {status === "ready" && banners.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Ảnh</th>
                    <th className="px-4 py-3 font-bold">Tiêu đề</th>
                    <th className="px-4 py-3 font-bold">Vị trí</th>
                    <th className="px-4 py-3 font-bold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <img
                          src={banner.imageUrl}
                          alt={`Ảnh banner ${banner.title}`}
                          loading="lazy"
                          className="h-14 w-24 rounded-lg bg-slate-100 object-cover"
                        />
                      </td>
                      <td className="max-w-sm px-4 py-3">
                        <p className="font-bold text-slate-900">{banner.title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{banner.linkUrl}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{banner.position}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${banner.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                          {banner.isActive ? "Đang bật" : "Đang tắt"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-700"
                            onClick={() => openEditForm(banner)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === banner._id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            onClick={() => handleDelete(banner)}
                          >
                            {deletingId === banner._id ? (
                              <span className="inline-flex items-center gap-1.5">
                                <LoaderCircle size={14} className="animate-spin" />
                                Đang xóa...
                              </span>
                            ) : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              {pagination.total} banner · Trang {pagination.page} /{" "}
              {Math.max(pagination.totalPages, 1)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40"
                onClick={() => setPage((current) => current - 1)}
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:opacity-40"
                onClick={() => setPage((current) => current + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}

      {formOpen && (
        <BannerFormModal
          banner={editingBanner}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          formError={formError}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onClose={closeForm}
        />
      )}
    </section>
  );
}

function BannerFormModal({
  banner,
  register,
  errors,
  isSubmitting,
  formError,
  handleSubmit,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="banner-form-title"
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Quản lý banner</p>
            <h2 id="banner-form-title" className="mt-1 text-xl font-black text-slate-950">
              {banner ? "Cập nhật banner" : "Thêm banner"}
            </h2>
          </div>
          <button type="button" aria-label="Đóng" disabled={isSubmitting} className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-slate-100" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-semibold text-slate-700">
            Tiêu đề *
            <input
              autoFocus
              className={inputClass}
              {...register("title", {
                required: "Vui lòng nhập tiêu đề.",
                minLength: { value: 2, message: "Tiêu đề cần ít nhất 2 ký tự." },
                maxLength: { value: 100, message: "Tiêu đề không vượt quá 100 ký tự." },
                validate: (value) => !/[<>]/.test(value) || "Tiêu đề không được chứa HTML.",
              })}
            />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            URL hình ảnh *
            <input
              type="url"
              className={inputClass}
              {...register("imageUrl", {
                required: "Vui lòng nhập URL hình ảnh.",
                pattern: { value: /^https?:\/\/.+/i, message: "URL phải bắt đầu bằng http hoặc https." },
              })}
            />
            {errors.imageUrl && <FieldError>{errors.imageUrl.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Public ID *
            <input
              className={inputClass}
              {...register("publicId", {
                required: "Vui lòng nhập publicId.",
                maxLength: { value: 255, message: "Public ID không vượt quá 255 ký tự." },
              })}
            />
            {errors.publicId && <FieldError>{errors.publicId.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Liên kết đích *
            <input
              className={inputClass}
              placeholder="/products hoặc https://example.com"
              {...register("linkUrl", {
                required: "Vui lòng nhập liên kết đích.",
                validate: (value) =>
                  (value.trim().startsWith("/") && !value.trim().startsWith("//")) ||
                  /^https?:\/\/.+/i.test(value.trim()) ||
                  "Chỉ dùng đường dẫn nội bộ hoặc URL http/https.",
              })}
            />
            {errors.linkUrl && <FieldError>{errors.linkUrl.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Vị trí *
            <input
              className={inputClass}
              placeholder="HERO_SLIDER"
              {...register("position", {
                required: "Vui lòng nhập vị trí.",
                pattern: {
                  value: /^[A-Z0-9_-]+$/,
                  message: "Vị trí chỉ gồm chữ hoa, số, gạch ngang và gạch dưới.",
                },
              })}
            />
            {errors.position && <FieldError>{errors.position.message}</FieldError>}
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-orange-600" {...register("isActive")} />
            Đang hoạt động
          </label>

          {formError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" disabled={isSubmitting} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" />
                  Đang lưu...
                </span>
              ) : "Lưu banner"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
