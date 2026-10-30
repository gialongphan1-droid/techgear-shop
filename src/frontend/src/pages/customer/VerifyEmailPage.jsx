import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyCustomerEmail } from "../../services/publicApi.js";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const requestRef = useRef(null);
  const [result, setResult] = useState({ status: "loading", message: "" });

  useEffect(() => {
    if (!token) {
      setResult({
        status: "error",
        message: "Liên kết xác thực không hợp lệ hoặc đã hết hạn.",
      });
      return undefined;
    }
    if (requestRef.current?.token !== token) {
      requestRef.current = { token, promise: verifyCustomerEmail(token) };
    }

    requestRef.current.promise
      .then((response) => {
        setResult({
          status: "success",
          message: response.data.message || "Email đã được xác thực thành công.",
        });
      })
      .catch((error) => {
        setResult({
          status: "error",
          message:
            error.response?.data?.message ||
            "Không thể xác thực email. Liên kết có thể đã hết hạn.",
        });
      });
    return undefined;
  }, [token]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12">
      <section className="w-full max-w-lg border border-slate-200 bg-white p-7 text-center shadow-soft sm:p-10">
        {result.status === "loading" ? (
          <>
            <LoaderCircle size={30} className="mx-auto animate-spin text-brand-700" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
              Đang xác thực email
            </h1>
          </>
        ) : (
          <>
            {result.status === "success" ? (
              <CheckCircle2 size={34} className="mx-auto text-emerald-700" />
            ) : (
              <XCircle size={34} className="mx-auto text-red-700" />
            )}
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
              {result.status === "success"
                ? "Xác thực thành công"
                : "Xác thực không thành công"}
            </h1>
            <p role={result.status === "error" ? "alert" : "status"} className="mt-3 text-sm leading-6 text-slate-600">
              {result.message}
            </p>
            <Link
              to={result.status === "success" ? "/login" : "/"}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {result.status === "success" ? "Đăng nhập" : "Về trang chủ"}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
