import { createBrowserRouter, Navigate } from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "../features/auth/PublicOnlyRoute.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Signup from "../features/auth/pages/Signup.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import TermsPage from "../features/legal/TermsPage.jsx";
import NotFound from "../features/not-found/NotFound.jsx";

import Home from "../pages/Home";
import ExploreProjects from "../pages/ExploreProjects";
import ProjectDetails from "../pages/ProjectDetails";
import MyProjects from "../pages/MyProjects";
import ProjectRequests from "../pages/ProjectRequests";
import CreateProject from "../pages/CreateProject";
import EditProject from "../pages/EditProject";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

// The ONE route table. Add a page here and nowhere else.
const router = createBrowserRouter([
  // Public pages: site header + footer
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/explore", element: <ExploreProjects /> },
      { path: "/projects/:projectId", element: <ProjectDetails /> },
    ],
  },

  // Login / signup: only for signed-out visitors (signed-in users are sent on)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/terms", element: <TermsPage /> },

  // Signed-in pages: need a login, otherwise redirected to /login
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Navigate to="/my-projects" replace /> },
      { path: "/my-projects", element: <DashboardLayout><MyProjects /></DashboardLayout> },
      { path: "/my-projects/:projectId/requests", element: <DashboardLayout><ProjectRequests /></DashboardLayout> },
      { path: "/my-projects/:projectId/edit", element: <DashboardLayout><EditProject /></DashboardLayout> },
      { path: "/create-project", element: <DashboardLayout><CreateProject /></DashboardLayout> },
      { path: "/notifications", element: <DashboardLayout><Notifications /></DashboardLayout> },
      { path: "/profile", element: <DashboardLayout><Profile /></DashboardLayout> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
