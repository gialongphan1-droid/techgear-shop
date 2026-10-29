import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { loginAdmin } from "../../services/adminApi.js";
import { setAdminSession } from "../../store/adminSessionSlice.js";

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
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
        requestedPath?.startsWith("/admin") && requestedPath !== "/admin/login"
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
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-950">
          TECH<span className="text-orange-600">GEAR</span>
        </Link>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
          Khu vực quản trị
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Đăng nhập Admin</h1>
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
          <label className="block text-sm font-semibold text-slate-700">
            Mật khẩu
            <input
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className={fieldClass}
              {...register("password", { required: "Vui lòng nhập mật khẩu." })}
            />
            {errors.password && <span className="mt-1 block text-sm text-red-700">{errors.password.message}</span>}
          </label>
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
