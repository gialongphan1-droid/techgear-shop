import { Scale } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCompareProduct,
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
  const isCompared = compareProducts.some(
    (item) => (item._id || item.slug) === (product._id || product.slug),
  );
  const compareLimitReached = compareProducts.length >= 3;
  const image =
    product.images?.find((item) => item.isPrimary)?.url ||
    product.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
            {product.brand}
          </p>
          <h3 className="mt-2 min-h-12 line-clamp-2 font-bold leading-6 text-slate-900">
            {product.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-lg font-black text-slate-950">
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
          disabled={isCompared || compareLimitReached}
          aria-label={
            isCompared
              ? `${product.name} đã có trong danh sách so sánh`
              : `Thêm ${product.name} vào so sánh`
          }
          title={compareLimitReached && !isCompared ? "Chỉ so sánh tối đa 3 sản phẩm" : undefined}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            dispatch(addCompareProduct(product));
            if (!isCompared && !compareLimitReached) {
              window.dispatchEvent(
                new CustomEvent("app:toast", {
                  detail: `${product.name} đã được thêm vào so sánh.`,
                }),
              );
            }
          }}
        >
          <Scale size={15} />
          {isCompared ? "Đã thêm" : "Thêm vào so sánh"}
        </button>
      </div>
    </article>
  );
}
