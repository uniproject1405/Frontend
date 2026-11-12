import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./layouts/DashboardLayout";
import MyProjects from "./pages/MyProjects";
import ProjectRequests from "./pages/ProjectRequests";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/my-projects" replace /> },
  {
    path: "/my-projects",
    element: (
      <DashboardLayout pageTitle="پروژه‌های من">
        <MyProjects />
      </DashboardLayout>
    ),
  },
  {
    path: "/my-projects/:projectId/requests",
    element: (
      <DashboardLayout pageTitle="درخواست‌های پروژه">
        <ProjectRequests />
      </DashboardLayout>
    ),
  },
  {
    path: "/create-project",
    element: (
      <DashboardLayout pageTitle="ساخت پروژه">
        <CreateProject />
      </DashboardLayout>
    ),
  },
  {
    path: "/my-projects/:projectId/edit",
    element: (
      <DashboardLayout pageTitle="ویرایش پروژه">
        <EditProject />
      </DashboardLayout>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <DashboardLayout pageTitle="پروژه">
        <ProjectDetails />
      </DashboardLayout>
    ),
  },
  {
    path: "/notifications",
    element: (
      <DashboardLayout pageTitle="اعلان‌ها">
        <Notifications />
      </DashboardLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <DashboardLayout pageTitle="پروفایل">
        <Profile />
      </DashboardLayout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
