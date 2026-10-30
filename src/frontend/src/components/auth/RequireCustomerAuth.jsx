import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setCustomerAuthChecking } from "../../store/userAuthSlice.js";

export default function RequireCustomerAuth() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.userAuth);

  if (status === "checking") {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-slate-600" role="status">
        <span className="inline-flex items-center gap-2">
          <LoaderCircle size={18} className="animate-spin" />
          Đang kiểm tra phiên đăng nhập...
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Không thể kiểm tra phiên
        </h1>
        <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">
          {error}
        </p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          onClick={() => dispatch(setCustomerAuthChecking())}
        >
          Thử lại
        </button>
      </section>
    );
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ returnTo: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
