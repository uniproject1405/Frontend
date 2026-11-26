
import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { setUnauthorizedHandler } from "../services/apiClient.js";
import {
  clearStored,
  readStored,
  saveStored,
} from "../utils/tokenStorage.js";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const save = useCallback((session, remember = true) => {
    saveStored(session, remember);
    setAuth(session);
  }, []);

  const login = useCallback(
    async (email, password, remember = true) => {
      const session = await authService.login({ email, password });
      save(session, remember);
    },
    [save]
  );

  const register = useCallback(
    async (name, email, password) => {
      const session = await authService.register({
        name,
        email,
        password,
      });
      save(session, true);
    },
    [save]
  );

  const completeGoogleLogin = useCallback(
    (token, user) => {
      save({ token, user }, true);
    },
    [save]
  );

  const clearSession = useCallback(() => {
    clearStored();
    setAuth({ token: null, user: null });
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    if (!readStored().token) return;

    authService
      .me()
      .then((user) => {
        if (user) {
          setAuth((previous) =>
            previous.token ? { ...previous, user } : previous
          );
        }
      })
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      login,
      register,
      completeGoogleLogin,
      logout,
    }),
    [auth, login, register, completeGoogleLogin, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
