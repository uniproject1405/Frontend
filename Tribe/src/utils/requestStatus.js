/*
  ثابت‌ها و تابع‌های کمکی صفحه «درخواست‌های من» (ارسال‌شده).
  وضعیت‌ها: pending | accepted | rejected
*/
export const REQUEST_STATUS = {
  pending: {
    label: "در انتظار بررسی",
    short: "در انتظار",
    message: "درخواست شما ارسال شده و منتظر بررسی صاحب پروژه است.",
    color: "warning",
  },
  accepted: {
    label: "پذیرفته‌شده",
    short: "پذیرفته شد",
    message: "درخواست شما پذیرفته شده است. برای شروع همکاری با صاحب پروژه هماهنگ کنید.",
    color: "success",
  },
  rejected: {
    label: "رد شده",
    short: "رد شده",
    message: "این بار همکاری شکل نگرفت. فرصت‌های دیگری در انتظار شماست.",
    color: "default",
  },
};

export const FILTERS = [
  { value: "all", label: "همه" },
  { value: "pending", label: REQUEST_STATUS.pending.label },
  { value: "accepted", label: REQUEST_STATUS.accepted.label },
  { value: "rejected", label: REQUEST_STATUS.rejected.label },
];

const dateFormat = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Tehran",
});

/** ISO → «۲۴ آبان ۱۴۰۵» */
export function formatDate(iso) {
  if (!iso) return "—";
  try {
    return dateFormat.format(new Date(iso));
  } catch {
    return "—";
  }
}

/** برای جست‌وجو: ی/ک عربی و فارسی یکسان */
export function normalizeText(text) {
  return String(text || "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .toLowerCase()
    .trim();
}

export function countByStatus(items) {
  const list = items || [];
  return {
    total: list.length,
    pending: list.filter((x) => x.request?.status === "pending").length,
    accepted: list.filter((x) => x.request?.status === "accepted").length,
    rejected: list.filter((x) => x.request?.status === "rejected").length,
  };
}
