import { useCallback, useEffect, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  uploadAdminImage,
} from "../../services/adminApi.js";

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

function notify(message) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export default function AdminCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [reload, setReload] = useState(0);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [iconError, setIconError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(
    () => () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    },
    [iconPreview],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  const loadCategories = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await getAdminCategories({ page, limit: 20 });
      setCategories(response.data.data.items);
      setPagination(response.data.data.pagination);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Không thể tải danh sách danh mục."),
      );
      setStatus("error");
    }
  }, [page]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, reload]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setFormOpen(true);
    setFormError("");
    setIconFile(null);
    setIconPreview("");
    setIconError("");
    reset({ name: "", slug: "", description: "", isActive: true });
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
    setFormError("");
    setIconFile(null);
    setIconPreview("");
    setIconError("");
    reset({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      isActive: category.isActive !== false,
    });
  };

  const closeForm = () => {
    if (isSubmitting) return;
    setFormOpen(false);
    setFormError("");
    setIconFile(null);
    setIconPreview("");
    setIconError("");
  };

  const handleIconSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type)) {
      setIconFile(null);
      setIconPreview("");
      setIconError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setIconFile(null);
      setIconPreview("");
      setIconError("Ảnh phải có dung lượng lớn hơn 0 và không vượt quá 5MB.");
      return;
    }

    setIconError("");
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setFormError("");
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      isActive: Boolean(values.isActive),
    };
    if (values.slug.trim()) payload.slug = values.slug.trim();

    try {
      if (iconFile) {
        setIsUploading(true);
        try {
          const uploadResponse = await uploadAdminImage(iconFile);
          payload.iconUrl = uploadResponse.data.data.url;
        } finally {
          setIsUploading(false);
        }
      }

      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, payload);
        notify("Danh mục đã được cập nhật.");
      } else {
        await createAdminCategory(payload);
        notify("Danh mục đã được tạo.");
      }
      setFormOpen(false);
      setIconFile(null);
      setIconPreview("");
      setIconError("");
      setReload((current) => current + 1);
    } catch (error) {
      const fieldErrors = error.response?.data?.errors || [];
      fieldErrors.forEach((fieldError) => {
        if (fieldError.field) {
          setError(fieldError.field, { message: fieldError.message });
        }
      });
      const message = getErrorMessage(error, "Không thể lưu danh mục.");
      setFormError(message);
      notify(message);
    }
  };

  const handleDelete = async (category) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa danh mục "${category.name}"? Thao tác này không thể hoàn tác.`,
      )
    ) {
      return;
    }

    setDeletingId(category._id);
    setErrorMessage("");
    try {
      await deleteAdminCategory(category._id);
      notify("Danh mục đã được xóa.");
      if (categories.length === 1 && page > 1) setPage((current) => current - 1);
      else setReload((current) => current + 1);
    } catch (error) {
      const message =
        error.response?.status === 409
          ? "Không thể xóa danh mục vì vẫn còn sản phẩm đang sử dụng. Hãy chuyển sản phẩm sang danh mục khác trước."
          : getErrorMessage(error, "Không thể xóa danh mục.");
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
            Danh mục
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-4 text-sm font-bold text-white transition hover:bg-orange-700"
          onClick={openCreateForm}
        >
          + Thêm danh mục
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {status === "loading" && (
        <div className="mt-6 grid gap-3" role="status">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
          <span className="sr-only">Đang tải danh mục...</span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center">
          <button
            type="button"
            className="font-bold text-orange-700 underline"
            onClick={() => setReload((current) => current + 1)}
          >
            Thử tải lại
          </button>
        </div>
      )}

      {status === "ready" && categories.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-900">Chưa có danh mục</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tạo danh mục để bắt đầu sắp xếp sản phẩm.
          </p>
          <button
            type="button"
            className="mt-4 font-bold text-orange-700 hover:text-orange-800"
            onClick={openCreateForm}
          >
            Tạo danh mục đầu tiên
          </button>
        </div>
      )}

      {status === "ready" && categories.length > 0 && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Tên danh mục</th>
                    <th className="px-4 py-3 font-bold">Slug</th>
                    <th className="px-4 py-3 font-bold">Mô tả</th>
                    <th className="px-4 py-3 font-bold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {category.name}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{category.slug}</td>
                      <td className="max-w-sm truncate px-4 py-4 text-slate-600">
                        {category.description || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            category.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {category.isActive ? "Đang bật" : "Đang tắt"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-200 hover:text-orange-700"
                            onClick={() => openEditForm(category)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === category._id}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            onClick={() => handleDelete(category)}
                          >
                            {deletingId === category._id ? (
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
              {pagination.total} danh mục · Trang {pagination.page} /{" "}
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
        <CategoryFormModal
          category={editingCategory}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          formError={formError}
          isUploading={isUploading}
          iconPreview={iconPreview || editingCategory?.iconUrl || ""}
          iconFileName={iconFile?.name || ""}
          iconError={iconError}
          onIconSelection={handleIconSelection}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onClose={closeForm}
        />
      )}
    </section>
  );
}

function CategoryFormModal({
  category,
  register,
  errors,
  isSubmitting,
  formError,
  isUploading,
  iconPreview,
  iconFileName,
  iconError,
  onIconSelection,
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
        aria-labelledby="category-form-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Quản lý danh mục
            </p>
            <h2 id="category-form-title" className="mt-1 text-xl font-black text-slate-950">
              {category ? "Cập nhật danh mục" : "Thêm danh mục"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-semibold text-slate-700">
            Tên danh mục *
            <input
              autoFocus
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              {...register("name", {
                required: "Vui lòng nhập tên danh mục.",
                minLength: { value: 2, message: "Tên cần ít nhất 2 ký tự." },
                maxLength: { value: 100, message: "Tên không vượt quá 100 ký tự." },
                validate: (value) => !/[<>]/.test(value) || "Tên không được chứa HTML.",
              })}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Slug (để trống để tự tạo)
            <input
              className={inputClass}
              aria-invalid={Boolean(errors.slug)}
              {...register("slug", {
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
                  message: "Slug chỉ gồm chữ, số và dấu gạch ngang.",
                },
              })}
            />
            {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Mô tả
            <textarea
              rows={3}
              maxLength={500}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              {...register("description", {
                maxLength: { value: 500, message: "Mô tả không vượt quá 500 ký tự." },
              })}
            />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
          </label>
          <div>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="category-icon">
              Ảnh biểu tượng
            </label>
            <label
              htmlFor="category-icon"
              className="mt-2 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <ImagePlus size={17} className="text-orange-600" />
              Chọn ảnh từ thiết bị
            </label>
            <input
              id="category-icon"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onIconSelection}
            />
            {iconError && <FieldError>{iconError}</FieldError>}
            {iconPreview && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={iconPreview}
                  alt="Xem trước ảnh danh mục"
                  className="h-16 w-16 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                />
                <p className="text-xs leading-5 text-slate-500">
                  {iconFileName ? `Ảnh mới: ${iconFileName}` : "Ảnh biểu tượng hiện tại"}
                </p>
              </div>
            )}
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-orange-600"
              {...register("isActive")}
            />
            Đang hoạt động
          </label>

          {formError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl bg-orange-600 px-5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" />
                  {isUploading ? "Đang tải ảnh..." : "Đang lưu..."}
                </span>
              ) : "Lưu danh mục"}
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
