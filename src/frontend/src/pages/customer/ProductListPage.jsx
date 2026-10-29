import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/storefront/ProductCard.jsx";
import { getStorefrontCategories, getStorefrontProducts } from "../../services/storefrontService.js";

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterError, setFilterError] = useState("");
  const [status, setStatus] = useState("loading");
  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      search: searchParams.get("search") || "",
    }),
    [queryString],
  );

  useEffect(() => {
    let active = true;
    setStatus("loading");

    getStorefrontProducts(Object.fromEntries(new URLSearchParams(queryString)))
      .then((response) => {
        if (!active) return;
        setProducts(response.data.items || []);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [queryString]);

  useEffect(() => {
    let active = true;
    Promise.all([
      getStorefrontCategories(),
      getStorefrontProducts({ limit: 100 }),
    ])
      .then(([categoryResponse, productResponse]) => {
        if (!active) return;
        setCategories(categoryResponse.data.items || []);
        setBrands(
          [...new Set((productResponse.data.items || []).map((product) => product.brand))]
            .filter(Boolean)
            .sort(),
        );
        setFilterError("");
      })
      .catch((error) => {
        if (active) {
          setFilterError(
            error.response?.data?.message ||
              "Không thể tải các tùy chọn bộ lọc.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const updateFilter = (key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const clearFilters = () => setSearchParams({});

  return (
    <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <Helmet>
        <title>
          {filters.category
            ? `${categories.find((category) => category.slug === filters.category)?.name || "Danh mục"} | Sản phẩm TechGear`
            : "Sản phẩm máy tính và linh kiện | TechGear Shop"}
        </title>
        <meta
          name="description"
          content={
            filters.search
              ? `Tìm sản phẩm ${filters.search} tại TechGear Shop. Xem laptop, linh kiện, màn hình và thiết bị công nghệ chính hãng.`
              : "Duyệt và lọc laptop, linh kiện máy tính, màn hình và thiết bị ngoại vi tại TechGear Shop."
          }
        />
        <link rel="canonical" href={`${window.location.origin}/products`} />
      </Helmet>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
            Khám phá TechGear
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Tất cả sản phẩm
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          {status === "ready" ? `${products.length} sản phẩm` : "Đang cập nhật..."}
        </p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          {filterError && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-800">
              {filterError}
            </p>
          )}
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-950">Bộ lọc</h2>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
                {activeFilterCount}
              </span>
            )}
          </div>
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Danh mục
            <select
              className={fieldClass}
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Thương hiệu
            <select
              className={fieldClass}
              value={filters.brand}
              onChange={(event) => updateFilter("brand", event.target.value)}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-slate-700">
              Khoảng giá (VND)
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="sr-only" htmlFor="min-price">
                Giá thấp nhất
              </label>
              <input
                id="min-price"
                type="number"
                min="0"
                step="100000"
                placeholder="Từ"
                value={filters.minPrice}
                className="h-11 min-w-0 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-500"
                onChange={(event) => updateFilter("minPrice", event.target.value)}
              />
              <label className="sr-only" htmlFor="max-price">
                Giá cao nhất
              </label>
              <input
                id="max-price"
                type="number"
                min="0"
                step="100000"
                placeholder="Đến"
                value={filters.maxPrice}
                className="h-11 min-w-0 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-orange-500"
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
              />
            </div>
          </fieldset>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Tìm kiếm
            <input
              type="search"
              placeholder="Tên hoặc thương hiệu"
              value={filters.search}
              className={fieldClass}
              onChange={(event) => updateFilter("search", event.target.value)}
            />
          </label>
          <button
            type="button"
            className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            onClick={clearFilters}
          >
            Xóa bộ lọc
          </button>
        </aside>

        <div>
          {status === "loading" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3" role="status">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
              ))}
              <span className="sr-only">Đang tải danh sách sản phẩm...</span>
            </div>
          )}
          {status === "error" && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
              Không thể tải danh sách. Vui lòng thử lại.
              <button
                type="button"
                className="ml-3 font-bold underline"
                onClick={() => setSearchParams(new URLSearchParams(queryString))}
              >
                Thử lại
              </button>
            </div>
          )}
          {status === "ready" && !products.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                Không có sản phẩm phù hợp
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Hãy thử thay đổi điều kiện lọc hoặc xóa bộ lọc.
              </p>
              <button
                type="button"
                className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
          {status === "ready" && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
