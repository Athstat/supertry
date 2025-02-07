/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          850: "#0D0D0D",
          900: "#0f172a",
          950: "#020617",
        },
        primary: {
          DEFAULT: "#23C16B",
          50: "#E9F7F0",
          100: "#D4F0E2",
          200: "#A9E1C5",
          300: "#7ED2A8",
          400: "#53C38B",
          500: "#23C16B",
          600: "#1C9A56",
          700: "#157340",
          800: "#0E4C2B",
          900: "#072515",
          950: "#03130B",
        },
      },
      borderColor: {
        DEFAULT: "rgb(229 231 235)",
        dark: "#1E1E2F",
      },
      boxShadow: {
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        ripple: {
          "0%": { width: "0px", height: "0px", opacity: 0.5 },
          "100%": { width: "500px", height: "500px", opacity: 0 },
        },
      },
      animation: {
        ripple: "ripple 0.6s linear forwards",
      },
    },
  },
  plugins: [],
};
