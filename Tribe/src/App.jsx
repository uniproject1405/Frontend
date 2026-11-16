import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import MyProjects from "./pages/MyProjects";
import ProjectRequests from "./pages/ProjectRequests";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ExploreProjects from "./pages/ExploreProjects";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/explore", element: <ExploreProjects /> },
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
      <PublicLayout>
        <ProjectDetails />
      </PublicLayout>
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
