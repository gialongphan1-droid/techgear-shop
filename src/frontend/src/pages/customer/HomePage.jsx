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
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="relative grid min-h-[420px] overflow-hidden rounded-xl bg-ink md:grid-cols-[1fr_0.92fr]">
            <div className="flex flex-col items-start justify-center px-7 py-10 text-white sm:px-12 lg:px-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 sm:text-sm">
                Thiết bị chọn lọc · Trải nghiệm vượt trội
              </p>
              <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {banner.title}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                Khám phá những lựa chọn công nghệ phù hợp cho công việc, học tập và giải trí.
              </p>
              <Link
                to={banner.linkUrl}
                className="group mt-8 inline-flex min-h-12 items-center gap-3 border-b border-brand-400 pb-1 text-sm font-semibold text-white transition-colors hover:text-brand-300"
                aria-label={banner.title}
              >
                Khám phá bộ sưu tập
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
            <div className="relative min-h-56 overflow-hidden bg-slate-800 md:min-h-full">
              <img
                src={banner.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-ink/10" />
            </div>
            {banners.length > 1 && (
              <div className="absolute bottom-5 left-7 z-10 flex items-center gap-3 sm:left-12 lg:left-16">
                <span className="text-xs font-medium tabular-nums text-slate-300">
                  {String(activeBanner + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Banner trước"
                  className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10"
                  onClick={() =>
                    setActiveBanner((activeBanner - 1 + banners.length) % banners.length)
                  }
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Banner tiếp theo"
                  className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white transition hover:border-white/50 hover:bg-white/10"
                  onClick={() => setActiveBanner((activeBanner + 1) % banners.length)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Khám phá theo nhu cầu
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Danh mục sản phẩm
            </h2>
          </div>
          <Link to="/products" className="hidden text-sm font-semibold text-brand-700 transition hover:text-brand-800 sm:inline">
            Tất cả danh mục
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.slug)}`}
              className="group flex min-h-28 items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft sm:p-5"
            >
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md bg-slate-50">
                <img
                  src={category.iconUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold leading-5 text-ink">{category.name}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition group-hover:text-brand-700">
                  Xem sản phẩm <ArrowUpRight size={13} />
                </span>
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
    <section className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {title}
            </h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800">
            Xem tất cả <ArrowUpRight size={16} />
          </Link>
        </div>
        {products.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border-y border-slate-200 py-8 text-center text-sm text-slate-600">
            Chưa có sản phẩm trong danh mục này.
          </p>
        )}
      </div>
    </section>
  );
}
