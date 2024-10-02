import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from "url";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY),
    },
    plugins: [react()],
    server: {
      host: "::",
      port: "8081",
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
        {
          find: "lib",
          replacement: resolve(__dirname, "lib"),
        },
        {
          find: 'axios',
          replacement: resolve(__dirname, 'node_modules/axios'),
        },
        {
          find: 'pdfjs-dist',
          replacement: resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf'),
        },
      ],
      alias: {
        'pdfjs-dist': resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.js'),
      },
    },
    optimizeDeps: {
      include: ['pdfjs-dist/build/pdf.worker.js'],
    },
  };
});
