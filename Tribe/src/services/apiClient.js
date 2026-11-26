import { getToken } from "../utils/tokenStorage.js";

// خالی = درخواست‌ها از طریق پروکسی Vite (vite.config.js) به بک‌اند می‌روند.
// مسیرها خودشان با /api شروع می‌شوند؛ پس اسلش و /api انتهای آدرس حذف می‌شود
// (VITE_API_URL=http://127.0.0.1:8000/api هم درست کار کند و /api/api نشود).
const BASE_URL = (import.meta.env.VITE_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// طبق مستندات بک‌اند فرمت هدر باید Token باشد، نه Bearer
const AUTH_SCHEME = "Token";

export class ApiError extends Error {
  constructor(status, data) {
    super("API error");
    this.status = status; // 0 یعنی خطای شبکه
    this.data = data;
  }
}

// AuthProvider این تابع را تنظیم می‌کند تا با خطای ۴۰۱ کاربر خارج شود
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `${AUTH_SCHEME} ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, null);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* پاسخ بدون بدنه */
  }

  if (!res.ok) {
    if (res.status === 401 && auth && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(res.status, data);
  }
  return data;
}
