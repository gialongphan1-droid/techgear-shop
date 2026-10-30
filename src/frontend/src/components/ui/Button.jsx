const variants = {
  default: "bg-ink text-white shadow-sm hover:bg-brand-700 hover:shadow-soft",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-ink",
};

const sizes = {
  default: "h-10 px-4 py-2",
  icon: "h-10 w-10",
  sm: "h-8 px-3 text-xs",
};

export default function Button({
  className = "",
  size = "default",
  variant = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
