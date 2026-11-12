import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWatch } from "react-hook-form";

export default function PasswordInput({
  autoComplete,
  className,
  control,
  id,
  isInvalid,
  onToggleVisibility,
  register,
  rules,
  showPassword,
}) {
  const password = useWatch({ control, name: "password", defaultValue: "" });
  const [scrollLeft, setScrollLeft] = useState(0);
  const registration = register("password", rules);
  const mask = "*".repeat(Array.from(String(password ?? "")).length);

  const handleChange = (event) => {
    const nextScrollLeft = event.currentTarget.scrollLeft;
    registration.onChange(event);
    setScrollLeft(nextScrollLeft);
  };

  const handleScroll = (event) => {
    setScrollLeft(event.currentTarget.scrollLeft);
  };

  return (
    <div className="relative isolate mt-2">
      <input
        {...registration}
        id={id}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        aria-invalid={isInvalid}
        className={`${className} ${
          showPassword ? "" : "password-asterisk-input font-mono relative z-20"
        }`}
        onChange={handleChange}
        onScroll={handleScroll}
      />
      {!showPassword && mask && (
        <span className="password-asterisk-mask font-mono" aria-hidden="true">
          <span style={{ transform: `translateX(-${scrollLeft}px)` }}>{mask}</span>
        </span>
      )}
      <button
        type="button"
        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        aria-pressed={showPassword}
        className="absolute right-3 top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        onClick={onToggleVisibility}
      >
        {showPassword ? (
          <EyeOff size={18} aria-hidden="true" />
        ) : (
          <Eye size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
