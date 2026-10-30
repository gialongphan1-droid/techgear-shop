import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { registerCustomer } from "../../services/publicApi.js";

const fieldClass =
  "mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { fullName: "", email: "", password: "" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const response = await registerCustomer({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setRegisteredEmail(response.data.data.user?.email || values.email.trim());
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Không thể tạo tài khoản. Vui lòng thử lại.",
      );
    }
  };

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        {registeredEmail ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Đăng ký thành công
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Kiểm tra email
            </h1>
            <p role="status" className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
              Vui lòng kiểm tra email để xác thực tài khoản
              {registeredEmail ? ` (${registeredEmail})` : ""}.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Đến trang đăng nhập
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Tài khoản TechGear
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Tạo tài khoản
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Xác thực email để sử dụng giỏ hàng và đặt hàng.
            </p>
            <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="block text-sm font-medium text-slate-700">
                Họ và tên
                <input
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  className={fieldClass}
                  {...register("fullName", {
                    required: "Vui lòng nhập họ và tên.",
                    minLength: { value: 2, message: "Họ tên cần ít nhất 2 ký tự." },
                    maxLength: { value: 100, message: "Họ tên tối đa 100 ký tự." },
                    validate: (value) => !/[<>]/.test(value) || "Họ tên không hợp lệ.",
                  })}
                />
                {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
              </label>
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
              <label className="block text-sm font-medium text-slate-700">
                Mật khẩu
                <input
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  className={fieldClass}
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu.",
                    minLength: { value: 8, message: "Mật khẩu tối thiểu 8 ký tự." },
                    validate: (value) =>
                      (/[A-Za-z]/.test(value) && /\d/.test(value)) ||
                      "Mật khẩu cần có ít nhất một chữ cái và một chữ số.",
                  })}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </label>
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                Đăng nhập
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

function FieldError({ children }) {
  return <span className="mt-1 block text-sm font-normal text-red-700">{children}</span>;
}
