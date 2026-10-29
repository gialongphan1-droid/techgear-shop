import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createAdminProduct,
  getAdminCategories,
  getAdminProduct,
  uploadAdminImage,
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
    setValue,
    clearErrors,
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
      images: [],
      specs: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });
  const {
    fields: imageFields,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specs" });
  const listPrice = watch("listPrice");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const selectedFilesRef = useRef(selectedFiles);
  selectedFilesRef.current = selectedFiles;
  const imageValues = watch("images") || [];

  useEffect(
    () => () => {
      selectedFilesRef.current.forEach((selection) =>
        URL.revokeObjectURL(selection.preview),
      );
    },
    [],
  );

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setFileError("");
    setSelectedFiles((current) => {
      current.forEach((selection) => URL.revokeObjectURL(selection.preview));
      return [];
    });

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
            : [];
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

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!allowedTypes.has(file.type)) {
        invalidFiles.push(`${file.name}: định dạng không được hỗ trợ.`);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name}: dung lượng vượt quá 5MB.`);
      } else if (file.size === 0) {
        invalidFiles.push(`${file.name}: file ảnh đang trống.`);
      } else {
        validFiles.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    if (invalidFiles.length) {
      setFileError(invalidFiles.join(" "));
    } else {
      setFileError("");
    }
    if (validFiles.length) {
      clearErrors("images");
      setSelectedFiles((current) => [...current, ...validFiles]);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((current) => {
      const selection = current[index];
      if (selection) URL.revokeObjectURL(selection.preview);
      return current.filter((_, fileIndex) => fileIndex !== index);
    });
  };

  const onSubmit = async (values) => {
    setServerError("");

    let hasPrimaryImage = false;
    const images = (values.images || [])
      .filter((image) => image.url?.trim() && image.publicId?.trim())
      .map((image) => {
        const isPrimary = Boolean(image.isPrimary && !hasPrimaryImage);
        hasPrimaryImage = hasPrimaryImage || isPrimary;
        return {
          url: image.url.trim(),
          publicId: image.publicId.trim(),
          isPrimary,
        };
      });

    if (!images.length && !selectedFiles.length) {
      setError("images", { message: "Cần ít nhất một ảnh hợp lệ." });
      return;
    }

    try {
      const uploadedImages = [];
      if (selectedFiles.length) {
        setIsUploading(true);
        for (const selection of selectedFiles) {
          const response = await uploadAdminImage(selection.file);
          const uploaded = response.data.data;
          uploadedImages.push({
            url: uploaded.url,
            publicId: uploaded.publicId,
            isPrimary: false,
          });
        }
      }

      uploadedImages.forEach((image, index) => {
        if (!hasPrimaryImage && index === 0) image.isPrimary = true;
      });
      const allImages = [...images, ...uploadedImages];
      if (!allImages.some((image) => image.isPrimary)) {
        allImages[0].isPrimary = true;
      }

      const productData = {
        name: values.name.trim(),
        categoryId: values.categoryId,
        brand: values.brand.trim(),
        listPrice: Number(values.listPrice),
        salePrice: values.salePrice === "" ? null : Number(values.salePrice),
        status: values.status,
        warranty: values.warranty.trim(),
        images: allImages,
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
    } finally {
      setIsUploading(false);
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
              <p className="mt-1 text-sm text-slate-500">
                Chọn một hoặc nhiều ảnh JPEG, PNG, WEBP hoặc GIF (tối đa 5MB mỗi ảnh).
              </p>
            </div>
          </div>
          <label className={`${labelClass} mt-5 block`}>
            Chọn ảnh
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isSubmitting}
              className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-orange-50 file:px-4 file:py-3 file:font-bold file:text-orange-700 hover:file:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              onChange={handleFileSelection}
            />
          </label>
          {fileError && (
            <p role="alert" className="mt-3 text-sm text-red-700">{fileError}</p>
          )}
          {isUploading && (
            <p role="status" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
              <LoaderCircle size={16} className="animate-spin" />
              Đang tải ảnh lên Cloudinary...
            </p>
          )}

          {imageFields.length > 0 && (
            <>
              <h3 className="mt-6 text-sm font-bold text-slate-800">Ảnh đã tải lên</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3">
                <img
                  src={imageValues[index]?.url}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-slate-500">
                    {imageValues[index]?.publicId}
                  </p>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(imageValues[index]?.isPrimary)}
                      className="h-4 w-4 accent-orange-600"
                      onChange={(event) => {
                        setValue(
                          "images",
                          imageValues.map((image, imageIndex) => ({
                            ...image,
                            isPrimary: event.target.checked && imageIndex === index,
                          })),
                          { shouldDirty: true },
                        );
                      }}
                    />
                    Ảnh đại diện
                  </label>
                </div>
                <button
                  type="button"
                  aria-label="Gỡ ảnh"
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 size={18} />
                </button>
                <input type="hidden" {...register(`images.${index}.url`)} />
                <input type="hidden" {...register(`images.${index}.publicId`)} />
                <input type="hidden" {...register(`images.${index}.isPrimary`)} />
              </div>
            ))}
              </div>
            </>
          )}

          {selectedFiles.length > 0 && (
            <>
              <h3 className="mt-6 text-sm font-bold text-slate-800">
                Ảnh sẽ tải lên ({selectedFiles.length})
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {selectedFiles.map((selection, index) => (
                  <div key={`${selection.file.name}-${selection.file.lastModified}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-dashed border-orange-200 p-3">
                    <img
                      src={selection.preview}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{selection.file.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {(selection.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      aria-label={`Gỡ ${selection.file.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {!imageFields.length && !selectedFiles.length && (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
              <ImagePlus size={22} className="mx-auto mb-2" />
              Chưa có ảnh sản phẩm. Chọn ảnh để xem trước và tải lên.
            </div>
          )}
          {errors.images?.message && <FieldError>{errors.images.message}</FieldError>}
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
          <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-6 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? (
              <>
                <LoaderCircle size={16} className="mr-2 inline animate-spin" />
                {isUploading ? "Đang tải ảnh..." : "Đang lưu..."}
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
