import { useEffect, useState } from "react";
import {
  Boxes,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Package,
  Tags,
  TicketPercent,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient.js";
import {
  clearAdminSession,
  selectAdmin,
  setAdmin,
  setCsrfToken,
} from "../../store/adminSessionSlice.js";

const navigation = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Sản phẩm", to: "/admin/products", icon: Package },
  { label: "Danh mục", to: "/admin/categories", icon: Tags },
  { label: "Banner", to: "/admin/banners", icon: TicketPercent },
  { label: "Tồn kho", to: "/admin/inventory", icon: Boxes },
  { label: "Đơn hàng", to: "/admin/orders", icon: Package },
];

function readCsrfCookie() {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("csrf_token="));
  return cookie ? decodeURIComponent(cookie.slice("csrf_token=".length)) : null;
}

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(selectAdmin);
  const [status, setStatus] = useState("loading");
  const [retry, setRetry] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    axiosClient
      .get("/admin/me")
      .then((response) => {
        if (!active) return;
        dispatch(setAdmin(response.data.data.admin));
        const csrfToken = readCsrfCookie();
        if (csrfToken) dispatch(setCsrfToken(csrfToken));
        setStatus("authenticated");
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          dispatch(clearAdminSession());
          navigate("/admin/login", { replace: true });
          return;
        }
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [dispatch, navigate, retry]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await axiosClient.post("/admin/logout");
      dispatch(clearAdminSession());
      navigate("/admin/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Không thể đăng xuất. Vui lòng thử lại.",
      );
      setLoggingOut(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center px-4 text-slate-600" role="status">
        <span className="inline-flex items-center gap-2">
          <LoaderCircle size={18} className="animate-spin" />
          Đang kiểm tra phiên quản trị...
        </span>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <section className="max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-950">Không thể kiểm tra phiên quản trị</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Đã xảy ra lỗi khi kết nối. Vui lòng thử lại.
          </p>
          <button
            type="button"
            className="mt-5 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            onClick={() => {
              setStatus("loading");
              setRetry((current) => current + 1);
            }}
          >
            Thử lại
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="bg-slate-950 text-white lg:flex lg:min-h-screen lg:flex-col">
        <Link to="/admin" className="block border-b border-slate-800 px-6 py-5 text-xl font-black tracking-tight">
          TECH<span className="text-orange-500">GEAR</span>
          <span className="ml-2 text-xs font-semibold tracking-normal text-slate-400">ADMIN</span>
        </Link>
        <nav
          id="admin-navigation"
          aria-label="Điều hướng quản trị"
          className={`${mobileMenuOpen ? "flex" : "hidden"} flex-col gap-1 px-3 py-3 lg:flex lg:flex-1`}
        >
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-orange-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-slate-800 p-4 lg:block">
          <p className="truncate text-sm font-semibold">{admin?.name || admin?.email || "Quản trị viên"}</p>
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white disabled:opacity-50"
          >
            {loggingOut ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Đang đăng xuất...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Đăng xuất
              </>
            )}
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Đóng menu quản trị" : "Mở menu quản trị"}
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="text-sm font-semibold text-slate-500">Bảng điều khiển</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
              {admin?.name || admin?.email || "Quản trị viên"}
            </span>
            <button
              type="button"
              disabled={loggingOut}
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              {loggingOut ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  Đăng xuất
                </>
              )}
            </button>
          </div>
        </header>
        {logoutError && (
          <p role="alert" className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:px-7">
            {logoutError}
          </p>
        )}
        <main className="p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
