import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">
          TechGear Shop · 404
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Trang không tồn tại
        </h1>
        <p className="mt-3 leading-7 text-slate-600">
          Đường dẫn bạn truy cập không hợp lệ hoặc trang đã được di chuyển.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Quay về Trang chủ
        </Link>
      </section>
    </main>
  );
}
