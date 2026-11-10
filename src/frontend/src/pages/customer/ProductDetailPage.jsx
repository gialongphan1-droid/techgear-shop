import { useEffect, useState } from "react";
import { Check, Minus, Plus, Scale, ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/storefront/ProductCard.jsx";
import { setCartData } from "../../store/cartSlice.js";
import { selectCustomerUser } from "../../store/userAuthSlice.js";
import {
  addCustomerCartItem,
  getCustomerCart,
} from "../../services/publicApi.js";
import {
  addCompareProduct,
  getCompareProductId,
  MAX_COMPARE_PRODUCTS,
  selectCompareProducts,
} from "../../store/compareSlice.js";
import {
  getStorefrontProductBySlug,
  getStorefrontSimilarProducts,
} from "../../services/storefrontService.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

const showToast = (message) => {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartStatus = useSelector((state) => state.cart.status);
  const customer = useSelector(selectCustomerUser);
  const compareProducts = useSelector(selectCompareProducts);
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarStatus, setSimilarStatus] = useState("idle");

  useEffect(() => {
    if (product) {
      console.log(product);
    }
  }, [product]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setQuantity(1);
    getStorefrontProductBySlug(slug)
      .then((response) => {
        if (!active) return;
        setProduct(response.data);
        setStatus(response.data ? "ready" : "not-found");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?._id) return undefined;
    let active = true;
    setSimilarStatus("loading");
    setSimilarProducts([]);

    getStorefrontSimilarProducts(product._id)
      .then((response) => {
        if (!active) return;
        const items = response.data.items;
        setSimilarProducts(Array.isArray(items) ? items : []);
        setSimilarStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setSimilarProducts([]);
        setSimilarStatus("error");
      });

    return () => {
      active = false;
    };
  }, [product?._id]);

  if (status === "loading") {
    return (
      <>
        <Helmet>
          <title>{`Đang tải sản phẩm | TechGear Shop`}</title>
          <meta name="description" content="Thông tin chi tiết sản phẩm tại TechGear Shop." />
          <link rel="canonical" href={`${window.location.origin}/products/${slug}`} />
        </Helmet>
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8" role="status">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-slate-200" />
            <div className="space-y-5">
              <div className="h-8 rounded bg-slate-200" />
              <div className="h-20 rounded bg-slate-200" />
            </div>
          </div>
          <span className="sr-only">Đang tải thông tin sản phẩm...</span>
        </div>
      </>
    );
  }

  if (status === "not-found") {
    return (
      <>
        <Helmet>
          <title>Không tìm thấy sản phẩm | TechGear Shop</title>
          <meta name="description" content="Sản phẩm không tồn tại hoặc không còn được kinh doanh." />
          <link rel="canonical" href={`${window.location.origin}/products/${slug}`} />
        </Helmet>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-950">Không tìm thấy sản phẩm</h1>
          <p className="mt-2 text-slate-600">Sản phẩm có thể đã bị gỡ khỏi cửa hàng.</p>
          <Link to="/products" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-orange-600">
            Xem sản phẩm khác
          </Link>
        </section>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Helmet>
          <title>Thông tin sản phẩm | TechGear Shop</title>
          <meta name="description" content="Xem chi tiết sản phẩm tại TechGear Shop." />
          <link rel="canonical" href={`${window.location.origin}/products/${slug}`} />
        </Helmet>
        <section role="alert" className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-950">Không thể tải sản phẩm</h1>
          <p className="mt-2 text-slate-600">Vui lòng tải lại trang để thử lại.</p>
        </section>
      </>
    );
  }

  const images = product.images || [];
  const image = images[activeImage]?.url || images[0]?.url;
  const hasStockValue =
    product.stock !== undefined &&
    product.stock !== null &&
    product.stock !== "";
  const stockCount = hasStockValue ? Number(product.stock) : null;
  const hasValidStock =
    Number.isFinite(stockCount) && stockCount >= 0;
  const isAvailable =
    product.status === "ACTIVE" && hasValidStock && stockCount > 0;
  const availabilityLabel =
    product.status !== "ACTIVE"
      ? "Ngừng kinh doanh"
      : !hasValidStock
        ? "Không xác định tồn kho"
        : isAvailable
          ? "Còn hàng"
          : "Hết hàng";

  const handleQuantityChange = (nextQuantity) => {
    if (nextQuantity > 10) {
      showToast("Mỗi sản phẩm chỉ có thể mua tối đa 10 món.");
      return;
    }
    if (hasStockValue && nextQuantity > stockCount) {
      showToast(`Chỉ còn ${stockCount} sản phẩm trong kho.`);
      return;
    }
    setQuantity(Math.max(1, nextQuantity));
  };

  const handlePurchase = async (buyNow = false) => {
    if (!isAvailable || cartStatus === "loading") return;
    if (hasStockValue && quantity > stockCount) {
      showToast(`Chỉ còn ${stockCount} sản phẩm trong kho.`);
      return;
    }

    if (!customer) {
      navigate("/login", {
        state: { returnTo: `/products/${product.slug}` },
      });
      return;
    }

    try {
      const response = await addCustomerCartItem({
        productId: product._id,
        quantity,
      });
      dispatch(setCartData(response.data.data));
      showToast(`${product.name} đã được thêm vào giỏ hàng.`);
      if (buyNow) navigate("/checkout");
    } catch (error) {
      try {
        const cartResponse = await getCustomerCart();
        dispatch(setCartData(cartResponse.data.data));
      } catch {
        // Keep the original cart mutation error visible to the user.
      }
      showToast(
        error.response?.data?.message ||
          "Không thể thêm sản phẩm vào giỏ hàng.",
      );
    }
  };

  const handleCompare = () => {
    const alreadyCompared = compareProducts.some(
      (item) => getCompareProductId(item) === getCompareProductId(product),
    );
    if (alreadyCompared) {
      navigate("/compare");
      return;
    }
    if (compareProducts.length >= MAX_COMPARE_PRODUCTS) {
      showToast(
        `Chỉ có thể so sánh tối đa ${MAX_COMPARE_PRODUCTS} sản phẩm.`,
      );
      return;
    }
    dispatch(addCompareProduct(product));
    showToast(`${product.name} đã được thêm vào so sánh.`);
  };

  return (
    <>
      <Helmet>
        <title>{product.seo?.title || `${product.name} | TechGear Shop`}</title>
        <meta
          name="description"
          content={
            product.seo?.description ||
            `${product.name} chính hãng tại TechGear Shop. Xem giá, thông số kỹ thuật và chính sách bảo hành.`
          }
        />
        {product.seo?.keywords?.length > 0 && (
          <meta name="keywords" content={product.seo.keywords.join(", ")} />
        )}
        <link rel="canonical" href={`${window.location.origin}/products/${product.slug}`} />
      </Helmet>
      <article className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <nav aria-label="Điều hướng" className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-orange-700">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-orange-700">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((item, index) => (
                <button
                  key={item.publicId || item.url}
                  type="button"
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={index === activeImage}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${index === activeImage ? "border-orange-500" : "border-transparent"}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-black text-orange-700">
              {formatPrice(product.salePrice ?? product.listPrice)}
            </span>
            {product.salePrice != null && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.listPrice)}
              </span>
            )}
          </div>
          <p
            role="status"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              isAvailable
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isAvailable && <Check size={18} aria-hidden="true" />}
            {availabilityLabel}
          </p>
          {product.warranty && (
            <p className="mt-2 text-sm text-slate-600">
              Bảo hành: {product.warranty}
            </p>
          )}
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <span
                id="product-quantity-label"
                className="text-sm font-semibold text-slate-700"
              >
                Số lượng
              </span>
              <div
                role="group"
                aria-labelledby="product-quantity-label"
                className="inline-flex h-10 items-center rounded-lg border border-slate-200"
              >
                <button
                  type="button"
                  aria-label="Giảm số lượng"
                  disabled={!isAvailable || cartStatus === "loading" || quantity <= 1}
                  className="grid h-9 w-9 place-items-center rounded-l-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  className="min-w-10 text-center text-sm font-bold text-slate-900"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tăng số lượng"
                  disabled={!isAvailable || cartStatus === "loading" || quantity >= 10}
                  className="grid h-9 w-9 place-items-center rounded-r-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!isAvailable || cartStatus === "loading"}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 font-bold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 sm:flex-1"
                onClick={() => handlePurchase()}
              >
                <ShoppingCart size={19} aria-hidden="true" />
                {cartStatus === "loading"
                  ? "Đang đồng bộ giỏ hàng..."
                  : "Thêm vào giỏ"}
              </button>
              <button
                type="button"
                disabled={!isAvailable || cartStatus === "loading"}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-5 font-bold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 sm:flex-1"
                onClick={() => handlePurchase(true)}
              >
                Mua ngay
              </button>
            </div>
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 sm:w-auto"
              onClick={handleCompare}
            >
              <Scale size={18} aria-hidden="true" />
              {compareProducts.some(
                (item) => (item._id || item.slug) === (product._id || product.slug),
              )
                ? "Xem so sánh"
                : "Thêm vào so sánh"}
            </button>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-black text-slate-950">Thông số kỹ thuật</h2>
            {product.specs?.length ? (
              <dl className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
                {product.specs.map((spec) => (
                  <div key={spec.key || spec.name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 px-4 py-3 text-sm sm:px-5">
                    <dt className="font-medium text-slate-500">{spec.name}</dt>
                    <dd className="font-semibold text-slate-900">
                      {spec.value} {spec.unit}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Chưa có thông số kỹ thuật.</p>
            )}
          </section>
        </div>
      </div>
      </article>
      {similarStatus === "loading" && (
        <section
          className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
          aria-labelledby="similar-products-heading"
          role="status"
          aria-live="polite"
        >
          <h2
            id="similar-products-heading"
            className="text-2xl font-black text-slate-950"
          >
            Sản phẩm tương tự
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-xl bg-slate-200"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="sr-only">Đang tải sản phẩm tương tự...</span>
        </section>
      )}
      {similarStatus === "ready" && similarProducts.length > 0 && (
        <section
          className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
          aria-labelledby="similar-products-heading"
        >
          <h2
            id="similar-products-heading"
            className="text-2xl font-black text-slate-950"
          >
            Sản phẩm tương tự
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((similarProduct) => (
              <ProductCard
                key={similarProduct._id}
                product={similarProduct}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
