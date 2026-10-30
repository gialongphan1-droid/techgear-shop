import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm", to: "/products" },
  { label: "Giỏ hàng", to: "/cart" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_.8fr_1fr] lg:px-8">
        <div>
          <Link
            to="/"
            className="text-xl font-extrabold tracking-[-0.06em] text-white"
            aria-label="TechGear Shop - Trang chủ"
          >
            TECH<span className="text-brand-400">GEAR</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            TechGear Shop - thiết bị công nghệ và linh kiện máy tính cho góc
            làm việc, học tập và giải trí của bạn.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Khám phá</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {shopLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="transition-colors hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Chính sách & hỗ trợ</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Hỗ trợ đặt hàng và tư vấn sản phẩm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} TechGear Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
