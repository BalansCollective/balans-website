import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// Load OpenRouter API key from file if it exists
function loadOpenRouterKey() {
  const keyFile = path.resolve(__dirname, 'openrouter-key.txt');
  try {
    if (fs.existsSync(keyFile)) {
      const key = fs.readFileSync(keyFile, 'utf-8').trim();
      console.log('✅ Loaded OpenRouter API key from openrouter-key.txt');
      return key;
    }
  } catch (error) {
    console.warn('⚠️  Could not read openrouter-key.txt:', error);
  }
  return process.env.VITE_OPENROUTER_API_KEY || '';
}

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  
  // Define environment variables
  define: {
    'import.meta.env.VITE_OPENROUTER_API_KEY': JSON.stringify(loadOpenRouterKey()),
  },
  
  // Use absolute path for GitHub Pages deployment
  // When deploying to custom domain (balans-collective.com), base should be '/'
  // When deploying to github.io subdirectory, base should be '/balans-website/'
  base: process.env.GITHUB_PAGES_SUBDIRECTORY === 'true' ? '/balans-website/' : '/',

  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: 'buffer',
    },
  },
  
  // Polyfills for Node.js modules in browser
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
