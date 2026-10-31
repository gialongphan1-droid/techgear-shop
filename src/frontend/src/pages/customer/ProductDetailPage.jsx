import { useEffect, useState } from "react";
import { Check, Scale, ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setCartData } from "../../store/cartSlice.js";
import { selectCustomerUser } from "../../store/userAuthSlice.js";
import { addCustomerCartItem, getCustomerCart } from "../../services/publicApi.js";
import {
  addCompareProduct,
  getCompareProductId,
  MAX_COMPARE_PRODUCTS,
  selectCompareProducts,
} from "../../store/compareSlice.js";
import { getStorefrontProductBySlug } from "../../services/storefrontService.js";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

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

  useEffect(() => {
    let active = true;
    setStatus("loading");
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

  const handleAddToCart = async () => {
    if (!customer) {
      navigate("/login", {
        state: { returnTo: `/products/${product.slug}` },
      });
      return;
    }

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

  const handleCompare = () => {
    const alreadyCompared = compareProducts.some(
      (item) => getCompareProductId(item) === getCompareProductId(product),
    );
    if (alreadyCompared) {
      navigate("/compare");
      return;
    }
    if (compareProducts.length >= MAX_COMPARE_PRODUCTS) {
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
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Check size={18} />
            {product.stock > 0 ? "Sẵn sàng giao hàng" : "Tạm hết hàng"}
          </p>
          {product.warranty && (
            <p className="mt-2 text-sm text-slate-600">
              Bảo hành: {product.warranty}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={
                cartStatus === "loading" ||
                product.status !== "ACTIVE"
              }
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={19} />
              {cartStatus === "loading" ? "Đang đồng bộ giỏ hàng..." : "Thêm vào giỏ hàng"}
            </button>
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 sm:w-auto"
              onClick={handleCompare}
            >
              <Scale size={18} />
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
    </>
  );
}
