import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LayoutGrid,
  LogOut,
  LoaderCircle,
  Menu,
  Package,
  PackageSearch,
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
import { getStorefrontCategories } from "../../services/storefrontService.js";
import { logoutCustomer } from "../../services/publicApi.js";
import {
  clearCustomerSession,
  selectCustomerAuthStatus,
  selectCustomerUser,
} from "../../store/userAuthSlice.js";
import Button from "../ui/Button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
    isActive ? "text-brand-700" : "text-slate-700"
  }`;

function CategoryDropdown({ categories, categoryStatus, onNavigate }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Danh mục"
          title="Danh mục"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          <LayoutGrid size={19} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {categories.map((category) => (
          <DropdownMenuItem key={category._id} asChild>
            <Link
              to={`/products?category=${encodeURIComponent(category.slug)}`}
              onClick={onNavigate}
            >
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
        {categoryStatus === "loading" && (
          <DropdownMenuLabel role="status" className="font-normal text-slate-500">
            Đang tải danh mục...
          </DropdownMenuLabel>
        )}
        {categoryStatus === "error" && (
          <DropdownMenuLabel role="status" className="font-normal text-slate-500">
            Không thể tải danh mục.
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountControl({
  customer,
  authStatus,
  loggingOut,
  onLogout,
  onNavigate,
}) {
  const controlClassName =
    "inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";

  if (customer && authStatus === "authenticated") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Tài khoản"
            title="Tài khoản"
            className={controlClassName}
          >
            <UserRound size={20} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="truncate font-bold">{customer.fullName}</span>
            <span className="truncate text-xs font-normal text-slate-500">
              {customer.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/track-order" onClick={onNavigate}>
              <PackageSearch size={17} aria-hidden="true" />
              Tra cứu đơn hàng
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-orders" onClick={onNavigate}>
              <Package size={17} aria-hidden="true" />
              Đơn hàng của tôi
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loggingOut}
            onSelect={onLogout}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            {loggingOut ? (
              <LoaderCircle size={17} aria-hidden="true" className="animate-spin" />
            ) : (
              <LogOut size={17} aria-hidden="true" />
            )}
            {loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (authStatus === "checking") return null;

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/track-order"
        aria-label="Tra cứu đơn hàng"
        title="Tra cứu đơn hàng"
        className={controlClassName}
        onClick={onNavigate}
      >
        <PackageSearch size={20} aria-hidden="true" />
      </Link>
      <Link
        to="/login"
        aria-label="Đăng nhập"
        title="Đăng nhập"
        className={controlClassName}
        onClick={onNavigate}
      >
        <UserRound size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState("loading");
  const itemCount = useSelector(selectCartItemCount);
  const compareCount = useSelector(selectCompareProducts).length;
  const customer = useSelector(selectCustomerUser);
  const authStatus = useSelector(selectCustomerAuthStatus);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getStorefrontCategories()
      .then((response) => {
        if (!active) return;
        setCategories(response.data.items || []);
        setCategoryStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setCategoryStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);
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
          aria-controls="mobile-navigation"
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
          <div className="flex h-11 max-w-xl items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
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
              aria-label="Tìm kiếm sản phẩm"
            >
              Tìm kiếm
            </Button>
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          <CategoryDropdown categories={categories} categoryStatus={categoryStatus} />
          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>
        </nav>

        <div className="hidden items-center lg:flex">
          <AccountControl
            customer={customer}
            authStatus={authStatus}
            loggingOut={loggingOut}
            onLogout={handleLogout}
          />
        </div>

        <Link
          to="/compare"
          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          aria-label="So sánh sản phẩm"
          aria-describedby="compare-count-description"
          title="So sánh sản phẩm"
        >
          <Scale size={19} aria-hidden="true" />
          <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1 text-[11px] font-bold text-white">
            {compareCount}
          </span>
          <span id="compare-count-description" className="sr-only">
            {compareCount} sản phẩm đang so sánh
          </span>
        </Link>
        <Link
          to="/cart"
          className="relative ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 lg:ml-0"
          aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}
        >
          <ShoppingCart size={19} aria-hidden="true" />
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">
            {itemCount}
          </span>
        </Link>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <form
            className="mb-4 flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3"
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
              aria-label="Tìm kiếm sản phẩm"
            >
              Tìm
            </Button>
          </form>
          <div className="flex items-center justify-between px-2 py-1">
            <CategoryDropdown
              categories={categories}
              categoryStatus={categoryStatus}
              onNavigate={() => setMenuOpen(false)}
            />
            <AccountControl
              customer={customer}
              authStatus={authStatus}
              loggingOut={loggingOut}
              onLogout={handleLogout}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/products"
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              onClick={() => setMenuOpen(false)}
            >
              Tất cả sản phẩm
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
