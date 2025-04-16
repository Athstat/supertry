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
          DEFAULT: "#1196F5",
          50: "#EFF8FF",
          100: "#DEF0FF",
          200: "#B6E2FF",
          300: "#85CDFF",
          400: "#4AB0FB",
          500: "#1196F5",
          600: "#0A7DD6",
          700: "#0863AD",
          800: "#054A85",
          900: "#03315C",
          950: "#021D38",
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
