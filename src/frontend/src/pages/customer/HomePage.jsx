import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/storefront/ProductCard.jsx";
import {
  getStorefrontBanners,
  getStorefrontCategories,
  getStorefrontProducts,
} from "../../services/storefrontService.js";

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    let active = true;

    Promise.all([
      getStorefrontBanners(),
      getStorefrontCategories(),
      getStorefrontProducts({ limit: 8, sort: "popular" }),
      getStorefrontProducts({ limit: 8, sort: "newest" }),
    ])
      .then(([bannerResponse, categoryResponse, featuredResponse, newResponse]) => {
        if (!active) return;
        setBanners(bannerResponse.data.items || []);
        setCategories(categoryResponse.data.items || []);
        setFeaturedProducts(featuredResponse.data.items || []);
        setNewProducts(newResponse.data.items || []);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (banners.length < 2) return undefined;
    const timer = window.setInterval(
      () => setActiveBanner((current) => (current + 1) % banners.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (status === "loading") {
    return (
      <>
        <Helmet>
          <title>TechGear Shop | Máy tính và linh kiện chính hãng</title>
          <meta
            name="description"
            content="Khám phá laptop, linh kiện máy tính, màn hình và thiết bị ngoại vi tại TechGear Shop."
          />
          <link rel="canonical" href={`${window.location.origin}/`} />
        </Helmet>
        <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8 sm:px-6 lg:px-8" role="status">
          <div className="h-64 rounded-3xl bg-slate-200 sm:h-96" />
          <div className="h-10 w-56 rounded bg-slate-200" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-60 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <span className="sr-only">Đang tải dữ liệu cửa hàng...</span>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Helmet>
          <title>TechGear Shop | Máy tính và linh kiện chính hãng</title>
          <meta
            name="description"
            content="Khám phá laptop, linh kiện máy tính, màn hình và thiết bị ngoại vi tại TechGear Shop."
          />
          <link rel="canonical" href={`${window.location.origin}/`} />
        </Helmet>
        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black text-slate-950">
            Chưa thể tải dữ liệu cửa hàng
          </h1>
          <p className="mt-2 text-slate-600">Vui lòng tải lại trang để thử lại.</p>
          <button
            type="button"
            className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-orange-600"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </section>
      </>
    );
  }

  const banner = banners[activeBanner];

  return (
    <>
      <Helmet>
        <title>TechGear Shop | Máy tính và linh kiện chính hãng</title>
        <meta
          name="description"
          content="Khám phá laptop, linh kiện máy tính, màn hình và thiết bị ngoại vi tại TechGear Shop."
        />
        <link rel="canonical" href={`${window.location.origin}/`} />
      </Helmet>
      <div>
      {banner && (
        <section className="relative mx-auto max-w-[1440px] px-4 pt-5 sm:px-6 lg:px-8">
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-slate-900 sm:min-h-[420px]">
            <img
              src={banner.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/45 to-transparent" />
            <Link
              to={banner.linkUrl}
              className="group relative flex min-h-[300px] max-w-2xl flex-col justify-center px-7 py-12 text-white sm:min-h-[420px] sm:px-14"
              aria-label={banner.title}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300 sm:text-sm">
                Công nghệ cho mọi trải nghiệm
              </p>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                {banner.title}
              </h1>
              <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold transition group-hover:bg-orange-500">
                Khám phá sản phẩm <ArrowUpRight size={18} />
              </span>
            </Link>
            {banners.length > 1 && (
              <div className="absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
                <button
                  type="button"
                  aria-label="Banner trước"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-slate-950/30 text-white hover:bg-slate-950/70"
                  onClick={() =>
                    setActiveBanner((activeBanner - 1 + banners.length) % banners.length)
                  }
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Banner tiếp theo"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-slate-950/30 text-white hover:bg-slate-950/70"
                  onClick={() => setActiveBanner((activeBanner + 1) % banners.length)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
              Khám phá theo nhu cầu
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              Danh mục sản phẩm
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-bold text-orange-700 hover:text-orange-800 sm:inline">
            Tất cả danh mục
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.slug)}`}
              className="group relative min-h-36 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white sm:min-h-44 sm:p-6"
            >
              <img
                src={category.iconUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-45 transition group-hover:scale-105 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <span className="relative flex h-full min-h-28 items-end text-lg font-black sm:min-h-32">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection
        eyebrow="Được lựa chọn nhiều"
        title="Sản phẩm nổi bật"
        products={featuredProducts}
      />
      <ProductSection
        eyebrow="Cập nhật mới nhất"
        title="Sản phẩm mới"
        products={newProducts}
      />
      </div>
    </>
  );
}

function ProductSection({ eyebrow, title, products }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            {title}
          </h2>
        </div>
        <Link to="/products" className="text-sm font-bold text-orange-700 hover:text-orange-800">
          Xem tất cả
        </Link>
      </div>
      {products.length ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl bg-slate-50 p-8 text-center text-slate-600">
          Chưa có sản phẩm trong danh mục này.
        </p>
      )}
    </section>
  );
}
