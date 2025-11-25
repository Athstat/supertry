import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {validateEnvironmentVariables} from "./src/utils/envUtils";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

    validateEnvironmentVariables({
      apiBaseUrl: env.VITE_API_BASE_URL,
      amplitudeApiKey: env.VITE_AMPLITUDE_API_KEY,
      appEnvironment: env.VITE_APP_ENV,
      appsFlyerOneLinkBaseUrl: env.VITE_AF_ONELINK_BASE_URL,
      featureLeagueGroupId: env.VITE_FEATURE_LEAGUE_GROUP_ID,
    });

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            // Optimize image assets
            if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
    assetsInclude: [
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg',
      '**/*.webp',
      '**/*.avif',
    ],
    server: {
      historyApiFallback: true,
      host: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '10.0.2.2',
        'scrummy-app.ai',
        'scrummy-qa.onrender.com',
        'scrummy-qa-2.onrender.com',
        '.ngrok.io',
        '.ngrok-free.app',
        '.loca.lt',
      ],
      proxy: {
        '/api/v1': {
          target: 'http://localhost:8000', // Updated to Django server
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api\/v1/, '/api/v1'),
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
      allowedHosts: [
        'supertry.onrender.com',
        'localhost',
        '10.0.2.2',
        'scrummy-app.ai',
        'scrummy-qa.onrender.com',
        'scrummy-qa-2.onrender.com',
      ],
    },
  };
});
