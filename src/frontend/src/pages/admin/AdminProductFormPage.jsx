import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createAdminProduct,
  getAdminCategories,
  getAdminProduct,
  updateAdminProduct,
} from "../../services/adminApi.js";

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const labelClass = "block text-sm font-semibold text-slate-700";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    "Không thể lưu sản phẩm. Vui lòng kiểm tra kết nối và thử lại."
  );
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [serverError, setServerError] = useState("");
  const {
    register,
    control,
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      brand: "",
      listPrice: "",
      salePrice: "",
      stock: 0,
      status: "ACTIVE",
      warranty: "",
      images: [{ url: "", isPrimary: true, publicId: "manual/product-image" }],
      specs: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
    rules: { validate: (images) => images.length > 0 || "Cần ít nhất một ảnh." },
  });
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });
  const listPrice = watch("listPrice");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    const requests = [
      getAdminCategories({ limit: 100 }),
      ...(isEditing ? [getAdminProduct(id)] : []),
    ];

    Promise.all(requests)
      .then(([categoryResponse, productResponse]) => {
        if (!active) return;
        const categoryItems = categoryResponse.data.data.items;
        setCategories(categoryItems);
        if (isEditing) {
          const product = productResponse.data.data;
          const categoryId =
            typeof product.categoryId === "object"
              ? product.categoryId?._id
              : product.categoryId;
          const images = product.images?.length
            ? product.images.map((image, index) => ({
                ...image,
                isPrimary: image.isPrimary || index === 0,
              }))
            : [{ url: "", isPrimary: true, publicId: "manual/product-image" }];
          reset({
            name: product.name || "",
            slug: product.slug || "",
            categoryId: categoryId || "",
            brand: product.brand || "",
            listPrice: product.listPrice ?? "",
            salePrice: product.salePrice ?? "",
            stock: product.stock ?? 0,
            status: product.status || "ACTIVE",
            warranty: product.warranty || "",
            images,
            specs: product.specs || [],
            seoTitle: product.seo?.title || "",
            seoDescription: product.seo?.description || "",
            seoKeywords: product.seo?.keywords?.join(", ") || "",
          });
        } else if (categoryItems.length) {
          reset((current) => ({ ...current, categoryId: categoryItems[0]._id }));
        }
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        setServerError(getErrorMessage(error));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [id, isEditing, reset]);

  const onSubmit = async (values) => {
    setServerError("");

    const images = values.images
      .filter((image) => image.url.trim() && image.publicId.trim())
      .map((image) => ({
        url: image.url.trim(),
        publicId: image.publicId.trim(),
        isPrimary: Boolean(image.isPrimary),
      }));

    if (!images.length) {
      setError("images", { message: "Cần ít nhất một ảnh hợp lệ." });
      return;
    }

    if (!images.some((image) => image.isPrimary)) {
      images[0].isPrimary = true;
    }

    const productData = {
      name: values.name.trim(),
      categoryId: values.categoryId,
      brand: values.brand.trim(),
      listPrice: Number(values.listPrice),
      salePrice: values.salePrice === "" ? null : Number(values.salePrice),
      status: values.status,
      warranty: values.warranty.trim(),
      images,
      specs: values.specs
        .filter((spec) => spec.name?.trim() && spec.value?.trim())
        .map((spec) => ({
          key: spec.key?.trim() || spec.name.trim().toLowerCase().replace(/\s+/g, "-"),
          name: spec.name.trim(),
          value: spec.value.trim(),
          unit: spec.unit?.trim() || "",
        })),
    };

    if (values.slug.trim()) productData.slug = values.slug.trim();

    if (!isEditing) {
      productData.stock = Number(values.stock);
    }

    const seo = {
      title: values.seoTitle.trim(),
      description: values.seoDescription.trim(),
      keywords: values.seoKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    };
    if (seo.title || seo.description || seo.keywords.length) {
      productData.seo = seo;
    }

    try {
      if (isEditing) {
        await updateAdminProduct(id, productData);
      } else {
        await createAdminProduct(productData);
      }
      navigate("/admin/products", { replace: true });
    } catch (error) {
      const fieldErrors = error.response?.data?.errors || [];
      fieldErrors.forEach((fieldError) => {
        if (fieldError.field) {
          setError(fieldError.field, { message: fieldError.message });
        }
      });
      setServerError(getErrorMessage(error));
    }
  };

  if (status === "loading") {
    return <p className="py-16 text-center text-slate-600" role="status">Đang tải biểu mẫu...</p>;
  }

  if (status === "error") {
    return (
      <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="font-bold">Không thể mở biểu mẫu sản phẩm</h1>
        <p className="mt-2 text-sm">{serverError}</p>
        <Link to="/admin/products" className="mt-4 inline-flex font-bold underline">Quay lại danh sách</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/products" className="text-sm font-semibold text-slate-500 hover:text-orange-700">
          ← Danh sách sản phẩm
        </Link>
        <h1 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
          {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-black text-slate-950">Thông tin cơ bản</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Tên sản phẩm *
              <input
                className={inputClass}
                aria-invalid={Boolean(errors.name)}
                {...register("name", {
                  required: "Vui lòng nhập tên sản phẩm.",
                  minLength: { value: 2, message: "Tên cần ít nhất 2 ký tự." },
                  maxLength: { value: 100, message: "Tên không vượt quá 100 ký tự." },
                  validate: (value) => !/[<>]/.test(value) || "Tên không được chứa HTML.",
                })}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </label>
            <label className={labelClass}>
              Slug (để trống để tự tạo)
              <input
                className={inputClass}
                {...register("slug", {
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
                    message: "Slug chỉ gồm chữ, số và dấu gạch ngang.",
                  },
                })}
              />
              {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
            </label>
            <label className={labelClass}>
              Danh mục *
              <select className={inputClass} {...register("categoryId", { required: "Vui lòng chọn danh mục." })}>
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              {errors.categoryId && <FieldError>{errors.categoryId.message}</FieldError>}
            </label>
            <label className={labelClass}>
              Thương hiệu *
              <input
                className={inputClass}
                {...register("brand", {
                  required: "Vui lòng nhập thương hiệu.",
                  maxLength: { value: 100, message: "Thương hiệu không vượt quá 100 ký tự." },
                  validate: (value) => !/[<>]/.test(value) || "Thương hiệu không hợp lệ.",
                })}
              />
              {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-black text-slate-950">Giá và trạng thái</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Giá niêm yết (VND) *
              <input
                type="number"
                min="0"
                step="1000"
                className={inputClass}
                {...register("listPrice", {
                  required: "Vui lòng nhập giá niêm yết.",
                  deps: "salePrice",
                  validate: (value) => (Number(value) >= 0 && Number.isFinite(Number(value))) || "Giá không hợp lệ.",
                })}
              />
              {errors.listPrice && <FieldError>{errors.listPrice.message}</FieldError>}
            </label>
            <label className={labelClass}>
              Giá khuyến mãi (không bắt buộc)
              <input
                type="number"
                min="0"
                step="1000"
                className={inputClass}
                aria-invalid={Boolean(errors.salePrice)}
                {...register("salePrice", {
                  validate: (value) =>
                    value === "" ||
                    (Number.isFinite(Number(value)) &&
                      Number(value) >= 0 &&
                      Number(value) < Number(listPrice)) ||
                    "Giá khuyến mãi phải thấp hơn giá niêm yết.",
                })}
              />
              {errors.salePrice && <FieldError>{errors.salePrice.message}</FieldError>}
            </label>
            {!isEditing ? (
              <label className={labelClass}>
                Tồn kho ban đầu
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  {...register("stock", {
                    validate: (value) =>
                      (Number.isInteger(Number(value)) && Number(value) >= 0) ||
                      "Tồn kho phải là số nguyên không âm.",
                  })}
                />
                {errors.stock && <FieldError>{errors.stock.message}</FieldError>}
              </label>
            ) : (
              <div className={labelClass}>
                Tồn kho
                <p className={`${inputClass} flex items-center bg-slate-50 text-slate-500`}>
                  Được quản lý riêng trong màn hình tồn kho.
                </p>
              </div>
            )}
            <label className={labelClass}>
              Trạng thái bán
              <select className={inputClass} {...register("status")}>
                <option value="ACTIVE">Đang kinh doanh</option>
                <option value="PAUSED">Tạm ngưng</option>
                <option value="INACTIVE">Ngừng kinh doanh</option>
              </select>
            </label>
            <label className={labelClass}>
              Bảo hành
              <input className={inputClass} maxLength={200} {...register("warranty")} />
            </label>
          </div>
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {isEditing
              ? "Tồn kho không được gửi khi cập nhật sản phẩm. Hãy dùng màn hình quản lý tồn kho."
              : "Tồn kho ban đầu chỉ áp dụng khi tạo mới sản phẩm."}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">Hình ảnh sản phẩm</h2>
              <p className="mt-1 text-sm text-slate-500">Upload ảnh chưa được hỗ trợ; nhập URL và publicId ảnh.</p>
            </div>
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50" onClick={() => appendImage({ url: "", isPrimary: false, publicId: "" })}>
              + Thêm ảnh
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {imageFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <label className={labelClass}>
                  URL ảnh *
                  <input
                    type="url"
                    className={inputClass}
                    {...register(`images.${index}.url`, {
                      required: "Vui lòng nhập URL ảnh.",
                      pattern: {
                        value: /^https?:\/\/.+/i,
                        message: "URL ảnh phải bắt đầu bằng http hoặc https.",
                      },
                    })}
                  />
                  {errors.images?.[index]?.url && <FieldError>{errors.images[index].url.message}</FieldError>}
                </label>
                <label className={labelClass}>
                  Public ID *
                  <input
                    className={inputClass}
                    {...register(`images.${index}.publicId`, { required: "Vui lòng nhập publicId." })}
                  />
                  {errors.images?.[index]?.publicId && <FieldError>{errors.images[index].publicId.message}</FieldError>}
                </label>
                <div className="flex items-end gap-3 sm:flex-col sm:items-start sm:justify-end">
                  <label className="flex h-11 items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" className="h-4 w-4 accent-orange-600" {...register(`images.${index}.isPrimary`)} />
                    Ảnh đại diện
                  </label>
                  <button type="button" disabled={imageFields.length <= 1} className="text-sm font-bold text-red-700 disabled:opacity-40" onClick={() => removeImage(index)}>
                    Gỡ ảnh
                  </button>
                </div>
              </div>
            ))}
            {errors.images?.message && <FieldError>{errors.images.message}</FieldError>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-950">Thông số kỹ thuật</h2>
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50" onClick={() => appendSpec({ key: "", name: "", value: "", unit: "" })}>
              + Thêm thông số
            </button>
          </div>
          {specFields.length === 0 && <p className="mt-4 text-sm text-slate-500">Chưa có thông số. Có thể bổ sung sau.</p>}
          <div className="mt-4 space-y-3">
            {specFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_0.7fr_auto]">
                <label className={labelClass}>
                  Khóa
                  <input className={inputClass} {...register(`specs.${index}.key`)} />
                </label>
                <label className={labelClass}>
                  Tên thông số
                  <input className={inputClass} {...register(`specs.${index}.name`)} />
                </label>
                <label className={labelClass}>
                  Giá trị
                  <input className={inputClass} {...register(`specs.${index}.value`)} />
                </label>
                <label className={labelClass}>
                  Đơn vị
                  <input className={inputClass} {...register(`specs.${index}.unit`)} />
                </label>
                <button type="button" className="self-end pb-3 text-sm font-bold text-red-700" onClick={() => removeSpec(index)}>
                  Gỡ
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-black text-slate-950">SEO</h2>
          <div className="mt-5 grid gap-5">
            <label className={labelClass}>
              Tiêu đề SEO
              <input className={inputClass} maxLength={200} {...register("seoTitle")} />
            </label>
            <label className={labelClass}>
              Mô tả SEO
              <textarea className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" maxLength={500} {...register("seoDescription")} />
            </label>
            <label className={labelClass}>
              Từ khóa (phân cách bằng dấu phẩy)
              <input className={inputClass} {...register("seoKeywords")} />
            </label>
          </div>
        </section>

        {serverError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {serverError}
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Link to="/admin/products" className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Hủy
          </Link>
          <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-orange-600 px-6 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? (
              <>
                <LoaderCircle size={16} className="mr-2 inline animate-spin" />
                Đang lưu...
              </>
            ) : isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
