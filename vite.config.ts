import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

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
      ],
    },
  };
});
