import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
import { loginCustomer } from "../../services/publicApi.js";
import { setCustomerSession } from "../../store/userAuthSlice.js";

const fieldClass =
  "mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (credentials) => {
    setServerError("");
    try {
      const response = await loginCustomer(credentials);
      dispatch(setCustomerSession(response.data.data));
      const requestedPath =
        location.state?.returnTo || searchParams.get("returnTo");
      const returnTo =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.includes("://") &&
        !requestedPath.includes("//")
          ? requestedPath
          : "/";
      navigate(returnTo, { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Không thể đăng nhập. Vui lòng kiểm tra kết nối và thử lại.",
      );
    }
  };

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Tài khoản TechGear
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Đăng nhập
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Đăng nhập để quản lý giỏ hàng và hoàn tất đơn mua.
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              autoComplete="email"
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
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </label>
          <div className="text-sm font-medium text-slate-700">
            <label htmlFor="login-password">Mật khẩu</label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              control={control}
              isInvalid={Boolean(errors.password)}
              register={register}
              rules={{
                required: "Vui lòng nhập mật khẩu.",
                minLength: { value: 8, message: "Mật khẩu tối thiểu 8 ký tự." },
              }}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((visible) => !visible)}
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </div>
          {serverError && (
            <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition duration-200 hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Đăng ký
          </Link>
        </p>
      </section>
    </main>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
