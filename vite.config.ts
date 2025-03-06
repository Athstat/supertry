import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    server: {
      historyApiFallback: true,
      proxy: {
        "/api": {
          target: "http://qa-games-app.athstat-next.com",
          changeOrigin: true,
          secure: false,
          // Don't rewrite the path - keep the /api prefix
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
