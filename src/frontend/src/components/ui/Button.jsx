const variants = {
  default: "bg-slate-950 text-white hover:bg-orange-600",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
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
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
