import { ApiError, request } from "./client.js";
import { readStored } from "../lib/tokenStorage.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// پاسخ ورود/ثبت‌نام بک‌اند: { token, user: { id, email, username } }
function normalize(data) {
  return { token: data.token, user: data.user || null };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ----- حالت ساختگی (VITE_USE_MOCK=true) -----
// ورود: هر ایمیلی با رمز 12345678 · ثبت‌نام: همه‌چیز جز taken@example.com
const mockAuthApi = {
  async login({ email, password }) {
    await sleep(700);
    if (password === "12345678") {
      return { token: "mock-token", user: { id: 1, email, username: email } };
    }
    throw new ApiError(400, { non_field_errors: ["Invalid credentials."] });
  },
  async register({ name, email }) {
    await sleep(700);
    if (email === "taken@example.com") {
      throw new ApiError(400, { email: ["A user with this email already exists."] });
    }
    if (name === "نام تکراری") {
      throw new ApiError(400, { username: ["A user with this username already exists."] });
    }
    return { token: "mock-token", user: { id: 1, email, username: name } };
  },
  async logout() {},
  async me() {
    return readStored().user;
  },
};

// ----- حالت واقعی: آدرس‌ها طبق مستندات بک‌اند -----
const realAuthApi = {
  // POST /api/users/login/
  async login({ email, password }) {
    const data = await request("/api/users/login/", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    return normalize(data);
  },

  // POST /api/users/register/
  // «نام و نام خانوادگی» همان username بک‌اند است (حداکثر ۱۵۰ نویسه و یکتا).
  async register({ name, email, password }) {
    const data = await request("/api/users/register/", {
      method: "POST",
      body: { email, password, username: name },
      auth: false,
    });
    return normalize(data);
  },

  // POST /api/users/logout/ ← توکن را در سرور حذف می‌کند
  async logout() {
    await request("/api/users/logout/", { method: "POST" });
  },

  // GET /api/users/me/ ← کاربر فعلی (برای بررسی معتبر بودن توکن)
  async me() {
    return request("/api/users/me/");
  },
};

export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
