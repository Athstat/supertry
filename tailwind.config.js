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
        glow: {
          "0%, 100%": { boxShadow: "0 0 2px #3b82f6, 0 0 5px #3b82f6" },
          "50%": { boxShadow: "0 0 2px #3b82f6, 0 0 15px #3b82f6" },
        },
        shadow: {
          "0%, 100%": { boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)" },
          "50%": { boxShadow: "0 3px 6px rgba(0, 0, 0, 0.12)" },
        },
        "star-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        ripple: "ripple 0.6s linear forwards",
        glow: "glow 2s ease-in-out infinite",
        "star-pop": "star-pop 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
