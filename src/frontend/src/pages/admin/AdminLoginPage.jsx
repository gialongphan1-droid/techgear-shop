import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { loginAdmin } from "../../services/adminApi.js";
import { setAdminSession } from "../../store/adminSessionSlice.js";

const fieldClass =
  "mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (credentials) => {
    setServerError("");
    try {
      const response = await loginAdmin(credentials);
      const { admin, csrfToken } = response.data.data;
      dispatch(setAdminSession({ admin, csrfToken }));
      const requestedPath = searchParams.get("returnTo");
      const returnTo =
        typeof requestedPath === "string" &&
        (requestedPath === "/admin" || requestedPath.startsWith("/admin/")) &&
        !requestedPath.includes("://") &&
        !requestedPath.includes("//") &&
        requestedPath !== "/admin/login"
          ? requestedPath
          : "/admin";
      navigate(returnTo, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Không thể đăng nhập. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <Link to="/" className="text-xl font-extrabold tracking-[-0.06em] text-ink">
          TECH<span className="text-brand-600">GEAR</span>
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Khu vực quản trị
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Đăng nhập Admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Đăng nhập để quản lý sản phẩm và cửa hàng.
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              autoComplete="username"
              aria-invalid={Boolean(errors.email)}
              className={fieldClass}
              {...register("email", {
                required: "Vui lòng nhập email.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email chưa đúng định dạng.",
                },
              })}
            />
            {errors.email && <span className="mt-1 block text-sm text-red-700">{errors.email.message}</span>}
          </label>
          <div className="text-sm font-semibold text-slate-700">
            <label htmlFor="admin-login-password">Mật khẩu</label>
            <div className="relative mt-2">
              <input
                id="admin-login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                {...register("password", { required: "Vui lòng nhập mật khẩu." })}
              />
              <button
                type="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && <span className="mt-1 block text-sm text-red-700">{errors.password.message}</span>}
          </div>
          {serverError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {serverError}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} className="h-12 w-full">
            {isSubmitting ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Đang đăng nhập...
              </>
            ) : "Đăng nhập"}
          </Button>
        </form>
      </section>
    </main>
  );
}
