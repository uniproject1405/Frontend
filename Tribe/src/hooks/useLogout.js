import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "./useAuth.js";

/*
  خروج از حساب برای هر جای برنامه:
    const logout = useLogout();
    <MenuItem onClick={logout}>خروج</MenuItem>

  کار می‌کند: توکن را در سرور باطل و در مرورگر پاک می‌کند (AuthProvider)
  و کاربر را به صفحه ورود می‌برد.
*/
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);
}
