# Tribe — صفحه درخواست‌های همکاری من

این پروژه فقط شامل صفحه «درخواست‌های همکاری من» و فایل‌هایی است که همین صفحه به آن‌ها نیاز دارد. صفحه مستقیماً در آدرس ریشه (`/`) نمایش داده می‌شود و هیچ مسیر یا صفحه‌ی دیگری وجود ندارد.

## اجرا

```bash
npm install
npm run dev
```

ساخت نسخه نهایی: `npm run build`

## ساختار

- `src/main.jsx` — نقطه ورود؛ مستقیم صفحه را رندر می‌کند
- `src/pages/MyRequestsPage.jsx` — صفحه
- `src/layouts/DashboardLayout.jsx` و `src/components/SiteHeader.jsx` — هدر و قالب صفحه
- `src/components/requests/` — اجزای صفحه
- `src/services/` — خواندن درخواست‌ها و پس‌گرفتن درخواست (Local Storage)
- `src/mocks/seedData.js` — داده نمونه
- `src/utils/`, `src/theme/` — ابزارها و تم
