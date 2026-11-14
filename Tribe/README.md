# Tribe

فرانت‌اند ورود، ثبت‌نام و بازیابی رمز عبور (React + Vite + Material UI، راست‌چین).

## اجرا

```bash
npm install
npm run dev
```

فایل `.env.example` را به `.env` کپی کنید.

- **بک‌اند واقعی** (`VITE_USE_MOCK=false`): بک‌اند باید روی `http://127.0.0.1:8000` اجرا باشد.
  درخواست‌های `/api` از طریق پروکسی Vite به آن می‌روند (`vite.config.js`).
- **بدون بک‌اند** (`VITE_USE_MOCK=true`): داده ساختگی:

- ورود: هر ایمیل معتبر + رمز `12345678`
- ثبت‌نام: همه‌چیز جز `taken@example.com` (برای دیدن خطای «ایمیل تکراری»)

## ساختار

```
src/
├── main.jsx · App.jsx        نقطه شروع و مسیرها
├── api/                      ارتباط با سرور
│   ├── client.js             request، ApiError، مدیریت ۴۰۱
│   ├── auth.js               ورود/ثبت‌نام/خروج (واقعی و ساختگی)
│   └── errors.js             پیام‌های خطای فارسی
├── lib/tokenStorage.js       ذخیره و پاک کردن توکن در مرورگر
├── theme/                    تم Material UI و راست‌چین
├── styles/                   tokens.css (رنگ‌های مشترک) · motion.css (حرکت‌ها)
└── features/
    ├── auth/                 AuthProvider و useAuth، ProtectedRoute، فرم‌ها، صفحه‌های ورود/ثبت‌نام/فراموشی
    ├── logout/               مکانیسم خروج برای استفاده همه (LogoutButton و useLogout)
    ├── dashboard/            داشبورد (نمونه صفحه محافظت‌شده)
    ├── legal/                قوانین و حریم خصوصی
    └── not-found/            صفحه ۴۰۴ برای هر آدرس ناشناخته
public/                       لوگوی Tribe (همین فایل آیکون تب مرورگر هم هست)
```

## نکته‌ها

- برای محافظت از یک صفحه جدید، مسیرش را داخل `<ProtectedRoute>` در `App.jsx` بگذارید.
- برای خروج: `import { LogoutButton, useLogout } from "../logout/index.js"` (دکمه آماده یا hook برای هر منوی دلخواه).
- `useAuth.js` تنها محل ساخت `AuthContext` و هوک `useAuth` است؛ `AuthProvider.jsx` از همان استفاده می‌کند.
- رنگ‌ها را فقط از `styles/tokens.css` تغییر دهید تا همه صفحه‌ها هماهنگ بمانند.
- حرکت‌ها با تنظیم «کاهش حرکت» سیستم‌عامل خودکار خاموش می‌شوند؛ برای حذف کامل، import فایل `styles/motion.css` را از `main.jsx` بردارید.
