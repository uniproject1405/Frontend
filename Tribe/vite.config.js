import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // درخواست‌های /api را به بک‌اند محلی می‌فرستد؛ نیازی به تنظیم CORS در بک‌اند نیست
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
});
