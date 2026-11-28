import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // درخواست‌های /api را به بک‌اند محلی می‌فرستد؛ نیازی به تنظیم CORS در بک‌اند نیست
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      // عکس‌های پروفایل که بک‌اند در /media سرو می‌کند
      '/media': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
