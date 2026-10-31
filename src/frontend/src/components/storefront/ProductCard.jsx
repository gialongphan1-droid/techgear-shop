import { useState } from "react";
import { Cpu, Scale } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCompareProduct,
  getCompareProductId,
  MAX_COMPARE_PRODUCTS,
  selectCompareProducts,
} from "../../store/compareSlice.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const compareProducts = useSelector(selectCompareProducts);
  const productId = getCompareProductId(product);
  const isCompared = compareProducts.some(
    (item) => getCompareProductId(item) === productId,
  );
  const compareLimitReached = compareProducts.length >= MAX_COMPARE_PRODUCTS;
  const image =
    product.images?.find((item) => item.isPrimary)?.url ||
    product.images?.[0]?.url;

  const handleCompare = () => {
    if (isCompared) return;
    if (compareLimitReached) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: `Chỉ có thể so sánh tối đa ${MAX_COMPARE_PRODUCTS} sản phẩm.`,
        }),
      );
      return;
    }

    dispatch(addCompareProduct(product));
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: `${product.name} đã được thêm vào so sánh.`,
      }),
    );
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200/90 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift">
      <Link to={`/products/${product.slug}`} className="block">
        <ProductArtwork key={image || product._id || product.slug} image={image} name={product.name} />
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
            {product.brand}
          </p>
          <h3 className="mt-2 min-h-12 line-clamp-2 font-semibold leading-6 text-slate-900">
            {product.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-lg font-bold tracking-tight text-ink">
              {formatPrice(product.salePrice ?? product.listPrice)}
            </span>
            {product.salePrice != null && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.listPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          type="button"
          disabled={isCompared}
          aria-label={
            isCompared
              ? `${product.name} đã có trong danh sách so sánh`
              : `Thêm ${product.name} vào so sánh`
          }
          title={compareLimitReached && !isCompared ? "Chỉ so sánh tối đa 3 sản phẩm" : undefined}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleCompare}
        >
          <Scale size={15} />
          {isCompared ? "Đã thêm" : "Thêm vào so sánh"}
        </button>
      </div>
    </article>
  );
}

function ProductArtwork({ image, name }) {
  const [failed, setFailed] = useState(!image);

  return (
    <div className="aspect-[4/3] overflow-hidden bg-slate-50">
      {failed ? (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400"
          role="img"
          aria-label={`Không có ảnh cho ${name}`}
        >
          <Cpu size={34} strokeWidth={1.2} />
          <span className="text-[10px] font-semibold tracking-[0.18em]">
            TECHGEAR
          </span>
        </div>
      ) : (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
