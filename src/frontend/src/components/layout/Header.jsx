import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChevronDown,
  LogIn,
  LogOut,
  LoaderCircle,
  Menu,
  Scale,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItemCount } from "../../store/cartSlice.js";
import { selectCompareProducts } from "../../store/compareSlice.js";
import { logoutCustomer } from "../../services/publicApi.js";
import {
  clearCustomerSession,
  selectCustomerUser,
} from "../../store/userAuthSlice.js";
import Button from "../ui/Button.jsx";

const categoryLinks = [
  "Máy tính & Laptop",
  "Linh kiện máy tính",
  "Màn hình",
  "Thiết bị ngoại vi",
];

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-brand-700 ${
    isActive ? "text-brand-700" : "text-slate-700"
  }`;

export default function Header() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const itemCount = useSelector(selectCartItemCount);
  const compareCount = useSelector(selectCompareProducts).length;
  const customer = useSelector(selectCustomerUser);
  const navigate = useNavigate();
  const {
    handleSubmit: handleDesktopSubmit,
    register: registerDesktop,
    reset: resetDesktop,
  } = useForm({
    defaultValues: { search: "" },
  });
  const {
    handleSubmit: handleMobileSubmit,
    register: registerMobile,
    reset: resetMobile,
  } = useForm({
    defaultValues: { mobileSearch: "" },
  });

  const submitSearch = (search) => {
    const query = search.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutCustomer();
      dispatch(clearCustomerSession());
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: error.response?.data?.message || "Không thể đăng xuất. Vui lòng thử lại.",
        }),
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:gap-5 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </Button>

        <Link
          to="/"
          className="shrink-0 text-xl font-extrabold tracking-[-0.06em] text-ink sm:text-2xl"
          aria-label="TechGear Shop - Trang chủ"
        >
          TECH<span className="text-brand-600">GEAR</span>
        </Link>

        <form
          className="hidden min-w-0 flex-1 lg:block"
          role="search"
          onSubmit={handleDesktopSubmit(({ search }) => {
            submitSearch(search);
            resetDesktop();
          })}
        >
          <label className="sr-only" htmlFor="header-search">
            Tìm kiếm sản phẩm
          </label>
          <div className="flex h-11 max-w-xl items-center rounded-lg border border-slate-200 bg-slate-50/80 px-3 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              id="header-search"
              type="search"
              placeholder="Bạn đang tìm sản phẩm nào?"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              {...registerDesktop("search")}
            />
            <Button
              type="submit"
              size="sm"
              className="h-8"
            >
              Tìm kiếm
            </Button>
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Trang chủ
          </NavLink>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors hover:text-brand-700"
              aria-expanded={categoriesOpen}
              onClick={() => setCategoriesOpen((open) => !open)}
            >
              Danh mục <ChevronDown size={16} />
            </Button>
            {categoriesOpen && (
              <div className="absolute left-0 top-full mt-3 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lift">
                {categoryLinks.map((category) => (
                  <Link
                    key={category}
                    to="/products"
                    className="block rounded-md px-3 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>
          <NavLink to="/track-order" className={navLinkClass}>
            Tra cứu đơn
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            So sánh
          </NavLink>
        </nav>

        {customer ? (
          <div className="hidden items-center gap-3 lg:flex">
            <span className="inline-flex max-w-36 items-center gap-2 truncate text-sm font-medium text-slate-700" title={customer.fullName}>
              <UserRound size={17} className="shrink-0 text-brand-700" />
              {customer.fullName}
            </span>
            <button
              type="button"
              disabled={loggingOut}
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-700 disabled:opacity-50"
            >
              {loggingOut ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {loggingOut ? "Đang thoát..." : "Đăng xuất"}
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-brand-700 lg:inline-flex"
          >
            <LogIn size={17} />
            Đăng nhập
          </Link>
        )}

        <Link
          to="/compare"
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          aria-label={`So sánh, ${compareCount} sản phẩm`}
        >
          <Scale size={19} />
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1 text-[11px] font-bold text-white">
            {compareCount}
          </span>
        </Link>
        <Link
          to="/cart"
          className="relative ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 lg:ml-0"
          aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}
        >
          <ShoppingCart size={19} />
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">
            {itemCount}
          </span>
        </Link>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <form
            className="mb-4 flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3"
            role="search"
            onSubmit={handleMobileSubmit(({ mobileSearch }) => {
              submitSearch(mobileSearch);
              resetMobile();
            })}
          >
            <label className="sr-only" htmlFor="mobile-header-search">
              Tìm kiếm sản phẩm
            </label>
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              id="mobile-header-search"
              type="search"
              placeholder="Tìm kiếm sản phẩm"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              {...registerMobile("mobileSearch")}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="px-2 text-brand-700 hover:bg-transparent hover:text-brand-800"
            >
              Tìm
            </Button>
          </form>
          <nav className="flex flex-col gap-1">
            {customer ? (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-3">
                <span className="min-w-0 truncate text-sm font-semibold text-ink">
                  {customer.fullName}
                </span>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-600 disabled:opacity-50"
                >
                  <LogOut size={14} />
                  {loggingOut ? "Đang thoát" : "Đăng xuất"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={16} /> Đăng nhập
              </Link>
            )}
            <NavLink
              to="/"
              end
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuOpen(false)}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/products"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuOpen(false)}
            >
              Tất cả sản phẩm
            </NavLink>
            <NavLink
              to="/track-order"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuOpen(false)}
            >
              Tra cứu đơn hàng
            </NavLink>
            <NavLink
              to="/compare"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuOpen(false)}
            >
              So sánh sản phẩm ({compareCount})
            </NavLink>
            <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Danh mục
            </p>
            {categoryLinks.map((category) => (
              <Link
                key={category}
                to="/products"
                className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
