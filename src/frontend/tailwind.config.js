const brand = {
  50: "#fff7f2",
  100: "#ffeadc",
  200: "#ffd1b6",
  300: "#ffb185",
  400: "#f88b5a",
  500: "#e96b38",
  600: "#c9552a",
  700: "#a84322",
  800: "#87391f",
  900: "#6f321e",
  950: "#3d190f",
};

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand,
        orange: brand,
        ink: "#131b27",
        canvas: "#f5f6f8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 28px rgb(19 27 39 / 6%)",
        lift: "0 16px 36px rgb(19 27 39 / 10%)",
      },
    },
  },
  plugins: [],
};
