import { useEffect } from "react";
import { authService } from "../services/authService.js";
import { useAuth } from "./useAuth.js";

// Negar's Google flow: start at the backend, come back with ?token= (or ?error=).
// Returns a click handler; onInfo/onError show messages on the page.
export function useGoogleReturn(mode, onError, onInfo) {
  const { completeGoogleLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    if (!token && !error) return;
    window.history.replaceState({}, document.title, window.location.pathname);
    if (token) {
      const email = params.get("email") || "";
      completeGoogleLogin(token, { email, username: params.get("username") || email });
    } else {
      onError(error);
    }
  }, [completeGoogleLogin, onError]);

  return () => {
    const url = authService.googleLoginUrl(mode);
    if (url) window.location.assign(url);
    else onInfo("ورود با گوگل فقط با بک‌اند واقعی کار می‌کند.");
  };
}
