import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

// صفحه‌های ورود/ثبت‌نام: کاربر واردشده (یا تازه واردشده) به کاوش پروژه‌ها می‌رود
export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/explore" replace />;
  return <Outlet />;
}
