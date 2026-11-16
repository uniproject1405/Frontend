import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// دسترسی به وضعیت ورود در هر کامپوننت: const { user, isAuthenticated, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
