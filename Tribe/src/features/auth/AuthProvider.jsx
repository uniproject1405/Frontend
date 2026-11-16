import { useCallback, useEffect, useMemo, useState } from "react";
import { authApi, setUnauthorizedHandler } from "../../api/index.js";
import { clearStored, readStored, saveStored } from "../../lib/tokenStorage.js";
import { AuthContext } from "./useAuth.js";

/*
  وضعیت ورود کل برنامه:
  - توکن و کاربر از مرورگر خوانده می‌شود (با رفرش صفحه از دست نمی‌رود)
  - login / register توکن را ذخیره می‌کنند
  - logout توکن را در سرور باطل می‌کند و در مرورگر پاک می‌کند؛ ProtectedRoute خودکار به /login می‌برد
  - اگر سرور ۴۰۱ بدهد (توکن منقضی یا باطل)، نشست فقط در مرورگر پاک می‌شود
*/
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const save = useCallback((session, remember) => {
    saveStored(session, remember);
    setAuth(session);
  }, []);

  const login = useCallback(
    async (email, password, remember = true) => {
      save(await authApi.login({ email, password }), remember);
    },
    [save]
  );

  const register = useCallback(
    async (name, email, password) => {
      save(await authApi.register({ name, email, password }), true);
    },
    [save]
  );

  // پاک کردن نشست فقط در مرورگر
  const clearSession = useCallback(() => {
    clearStored();
    setAuth({ token: null, user: null });
  }, []);

  // خروج کاربر: درخواست به سرور (توکن همین حالا خوانده می‌شود) و بعد پاک کردن محلی.
  // اگر درخواست شکست بخورد هم کاربر خارج می‌شود.
  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearSession();
  }, [clearSession]);

  // خطای ۴۰۱ از سرور → فقط پاک‌سازی محلی (درخواست خروج دوباره نمی‌فرستیم تا حلقه نشود)
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  // با باز شدن برنامه، اگر توکن ذخیره است معتبر بودنش را از سرور بپرس.
  // توکن باطل ← ۴۰۱ ← نشست پاک می‌شود و کاربر به صفحه ورود می‌رود.
  useEffect(() => {
    if (!readStored().token) return;
    authApi
      .me()
      .then((user) => user && setAuth((prev) => (prev.token ? { ...prev, user } : prev)))
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      login,
      register,
      logout,
    }),
    [auth, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
