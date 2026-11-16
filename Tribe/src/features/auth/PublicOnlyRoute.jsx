import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth.js";

// Only internal paths are allowed as ?next= (blocks https://evil.example and //evil.example)
const safeNext = (value) => (value && value.startsWith("/") && !value.startsWith("//") ? value : null);

// Login/signup pages are for signed-out visitors; a signed-in user is sent on to ?next= or their projects.
export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const next = safeNext(new URLSearchParams(location.search).get("next"));
    return <Navigate to={next || "/my-projects"} replace />;
  }
  return <Outlet />;
}
