import { useState } from "react";
import { Cpu, Scale, ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCompareProductId,
  removeCompareProduct,
  selectCompareProducts,
} from "../../store/compareSlice.js";
import { addCustomerCartItem, getCustomerCart } from "../../services/publicApi.js";
import { setCartData } from "../../store/cartSlice.js";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function getImage(product) {
  return (
    product.images?.find((image) => image.isPrimary)?.url ||
    product.images?.[0]?.url ||
    product.imageUrl ||
    (typeof product.image === "string" ? product.image : product.image?.url) ||
    ""
  );
}

function getSpecValue(spec) {
  return [spec?.value, spec?.unit]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .join(" ") || "—";
}

export default function ComparePage() {
  const dispatch = useDispatch();
  const products = useSelector(selectCompareProducts);
  const categoryIds = new Set(
    products.map((product) => product.category?._id || product.categoryId),
  );
  const hasDifferentCategories = categoryIds.size > 1;
  const specRows = new Map();

  products.forEach((product) => {
    (product.specs || []).forEach((spec) => {
      const key = spec.key || spec.name;
      if (!key) return;
      if (!specRows.has(key)) {
        specRows.set(key, {
          key,
          name: spec.name || spec.key,
          values: new Map(),
        });
      }
      specRows.get(key).values.set(getCompareProductId(product), getSpecValue(spec));
    });
  });

  const removeProduct = (product) => {
    dispatch(removeCompareProduct(getCompareProductId(product)));
  };

  const addToCart = async (product) => {
    try {
      const response = await addCustomerCartItem({
        productId: product._id,
        quantity: 1,
      });
      dispatch(setCartData(response.data.data));
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: `${product.name} đã được thêm vào giỏ hàng.`,
        }),
      );
    } catch (error) {
      try {
        const cartResponse = await getCustomerCart();
        dispatch(setCartData(cartResponse.data.data));
      } catch {
        // Keep the original cart mutation error visible to the user.
      }
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail:
            error.response?.data?.message ||
            "Không thể thêm sản phẩm vào giỏ hàng.",
        }),
      );
    }
  };

  if (!products.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <Scale size={34} className="mx-auto text-orange-600" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">
          Danh sách so sánh đang trống
        </h1>
        <p className="mt-2 text-slate-600">
          Thêm từ 2 đến 3 sản phẩm để xem cấu hình cạnh nhau.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Khám phá sản phẩm
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
            Lựa chọn thông minh
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            So sánh sản phẩm
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Đang chọn {products.length}/3 sản phẩm.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {hasDifferentCategories && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
        >
          Các sản phẩm thuộc danh mục khác nhau nên bộ thông số kỹ thuật có thể
          không tương ứng trực tiếp.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-44 border-b border-r border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                Thông tin
              </th>
              {products.map((product) => (
                <th
                  key={getCompareProductId(product)}
                  className="w-72 border-b border-slate-200 p-4 align-top"
                >
                  <div className="flex h-full flex-col">
                    <Link to={`/products/${product.slug}`} className="group">
                      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                        <CompareProductImage product={product} />
                      </div>
                      <p className="mt-3 text-base font-black text-slate-950 group-hover:text-orange-700">
                        {product.name}
                      </p>
                    </Link>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <span className="font-black text-orange-700">
                        {currency.format(product.salePrice ?? product.listPrice)}
                      </span>
                      {product.salePrice != null && (
                        <span className="text-sm text-slate-400 line-through">
                          {currency.format(product.listPrice)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.category?.name ||
                        product.categoryName ||
                        "Danh mục khác"}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={product.stock <= 0 || product.status !== "ACTIVE"}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-orange-600 px-3 text-xs font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart size={14} />
                        Thêm vào giỏ
                      </button>
                      <button
                        type="button"
                        aria-label={`Xóa ${product.name} khỏi so sánh`}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeProduct(product)}
                      >
                        <Trash2 size={14} />
                        Xóa
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                key: "brand",
                name: "Thương hiệu",
                getValue: (product) => product.brand || "—",
              },
              {
                key: "category",
                name: "Danh mục",
                getValue: (product) =>
                  product.category?.name ||
                  product.categoryName ||
                  "—",
              },
              {
                key: "price",
                name: "Giá bán",
                getValue: (product) =>
                  currency.format(product.salePrice ?? product.listPrice),
              },
              {
                key: "warranty",
                name: "Bảo hành",
                getValue: (product) => product.warranty || "—",
              },
              ...Array.from(specRows.values()).map((row) => ({
                ...row,
                getValue: (product) =>
                  row.values.get(getCompareProductId(product)) || "—",
              })),
            ].map((row) => {
              const values = products.map((product) => row.getValue(product));
              const hasDifference = new Set(values).size > 1;
              return (
                <tr key={row.key}>
                  <th className="sticky left-0 z-10 border-r border-t border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    {row.name}
                  </th>
                  {products.map((product, index) => (
                    <td
                      key={getCompareProductId(product)}
                      className={`border-t border-slate-200 p-4 text-sm ${
                        hasDifference
                          ? "bg-orange-50 font-semibold text-orange-900"
                          : "text-slate-700"
                      }`}
                    >
                      {values[index]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Các ô được tô màu thể hiện thông tin khác nhau giữa các sản phẩm. Bảng
        có thể cuộn ngang trên màn hình nhỏ.
      </p>
    </section>
  );
}

function CompareProductImage({ product }) {
  const image = getImage(product);
  const [failed, setFailed] = useState(!image);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`Không có ảnh cho ${product.name}`}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400"
      >
        <Cpu size={34} strokeWidth={1.2} />
        <span className="text-[10px] font-semibold tracking-[0.18em]">
          TECHGEAR
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product.name}
      loading="lazy"
      className="h-full w-full object-cover transition group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
