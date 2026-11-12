import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/storefront/ProductCard.jsx";
import {
  getStorefrontBanners,
  getStorefrontProducts,
} from "../../services/storefrontService.js";

const GodLightsHero = lazy(() =>
  import("../../components/god-lights-hero.jsx").then((module) => ({
    default: module.GodLightsHero,
  })),
);

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    Promise.all([
      getStorefrontBanners(),
      getStorefrontProducts({ limit: 8, sort: "popular" }),
      getStorefrontProducts({ limit: 8, sort: "newest" }),
    ])
      .then(([bannerResponse, featuredResponse, newResponse]) => {
        if (!active) return;
        setBanners(bannerResponse.data.items || []);
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
          <div className="h-64 rounded-2xl bg-slate-200 sm:h-96" />
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
          <h1 className="text-2xl font-semibold text-ink">
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
      {banners.length > 0 && <BannerCarousel banners={banners} />}

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

function BannerCarousel({ banners }) {
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: banners.length > 1 });
  const [activeBanner, setActiveBanner] = useState(0);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const banner = banners[activeBanner];
  const snapCount = emblaApi?.scrollSnapList().length || banners.length;
  const isPaused = isPointerOver || hasFocus;

  useEffect(() => {
    if (!emblaApi) return undefined;

    const updateActiveBanner = () => setActiveBanner(emblaApi.selectedScrollSnap());
    updateActiveBanner();
    emblaApi.on("select", updateActiveBanner);
    emblaApi.on("reInit", updateActiveBanner);

    return () => {
      emblaApi.off("select", updateActiveBanner);
      emblaApi.off("reInit", updateActiveBanner);
    };
  }, [emblaApi]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (event) => setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!emblaApi || banners.length < 2 || isPaused || prefersReducedMotion) {
      return undefined;
    }

    const timer = window.setInterval(() => emblaApi.scrollNext(), 6000);
    return () => window.clearInterval(timer);
  }, [emblaApi, banners.length, isPaused, prefersReducedMotion]);

  const scrollTo = (index) => {
    emblaApi?.scrollTo(index, prefersReducedMotion);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white"
      role="region"
      aria-label="Banner nổi bật"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPointerOver(true)}
      onMouseLeave={() => setIsPointerOver(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={handleBlur}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
      >
        <Suspense fallback={null}>
          <GodLightsHero
            animated={!prefersReducedMotion}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
        </Suspense>
      </div>
      <div className="absolute inset-0 z-0" ref={viewportRef}>
        <div className="flex h-full touch-pan-y">
          {banners.map((item, index) => (
            <div
              key={item._id || item.imageUrl || item.title}
              className="relative min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${banners.length}`}
              aria-hidden="true"
            >
              <BannerArtwork
                key={item._id || item.imageUrl || item.title}
                imageUrl={item.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20 md:bg-gradient-to-r md:from-ink/85 md:via-ink/40 md:to-ink/10" />

      <div className="relative z-30 mx-auto flex min-h-[420px] max-w-7xl flex-col items-start justify-center px-5 py-20 sm:min-h-[460px] sm:px-10 sm:py-24 lg:min-h-[500px] lg:px-14">
        <div
          key={banner._id || banner.title || activeBanner}
          className="hero-copy-enter"
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${activeBanner + 1} of ${banners.length}`}
        >
          <p className="text-sm font-semibold text-brand-300">
            Công nghệ cho nhịp sống hiện đại
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:mt-5 sm:text-4xl lg:text-6xl">
            {banner.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:mt-5 sm:text-base sm:leading-7">
            Khám phá lựa chọn công nghệ phù hợp cho công việc, học tập và giải trí.
          </p>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-xs font-medium tabular-nums text-white/80">
              {String(activeBanner + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
            </span>
            <div role="group" aria-label="Chọn banner" className="flex items-center gap-1.5">
              {Array.from({ length: snapCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Hiển thị banner ${index + 1}`}
                  aria-current={activeBanner === index ? "true" : undefined}
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  onClick={() => scrollTo(index)}
                >
                  <span
                    className={`h-2.5 rounded-full transition-all group-hover:bg-white/80 ${
                      activeBanner === index
                        ? "w-7 bg-brand-400"
                        : "w-2.5 bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Banner trước"
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              onClick={() => scrollTo((activeBanner - 1 + snapCount) % snapCount)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Banner tiếp theo"
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              onClick={() => scrollTo((activeBanner + 1) % snapCount)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function BannerArtwork({ imageUrl }) {
  const [failed, setFailed] = useState(!imageUrl);

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-800 text-slate-400"
        aria-hidden="true"
      >
        <Cpu size={42} strokeWidth={1.2} />
        <span className="text-xs font-semibold tracking-[0.2em] text-slate-300">
          TECHGEAR
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-center"
      onError={() => setFailed(true)}
    />
  );
}

function ProductSection({ eyebrow, title, products }) {
  return (
    <section className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-700">
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
