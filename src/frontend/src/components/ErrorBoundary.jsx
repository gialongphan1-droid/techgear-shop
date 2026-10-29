import { Component } from "react";
import { RotateCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled application render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
          <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
              TechGear Shop
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Đã có lỗi xảy ra
            </h1>
            <p className="mt-3 leading-7 text-slate-600">
              Trang gặp sự cố ngoài dự kiến. Vui lòng tải lại để tiếp tục.
            </p>
            <button
              type="button"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
              onClick={() => window.location.reload()}
            >
              <RotateCw size={16} />
              Tải lại trang
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
