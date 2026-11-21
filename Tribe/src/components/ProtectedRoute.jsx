import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

// Signed-out visitors go to /login; the page they wanted is passed as ?next=
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <Outlet />;
}
