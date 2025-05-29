import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      historyApiFallback: true,
      proxy: {
        "/api/v1": {
          target: "https://athstat-games-server.onrender.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
      allowedHosts: ["supertry.onrender.com", "localhost", "scrummy-app.ai", "scrummy-qa.onrender.com"],
    },
  };
});
