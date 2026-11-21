import { useContext } from "react";

import { AuthContext } from "../context/AuthContext.js";

// دسترسی به وضعیت ورود در هر کامپوننت: const { user, isAuthenticated, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
