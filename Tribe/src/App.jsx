
import {
  createBrowserRouter,
  Navigate,
} from "react-router";

import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./layouts/DashboardLayout";

import CreateProject from "./pages/CreateProject";
import MyProjects from "./pages/MyProjects";
import EditProject from "./pages/EditProject";
import ProjectRequests from "./pages/ProjectRequests";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
  path: "/",
  element: (
    <DashboardLayout pageTitle="خانه">
      <Home />
    </DashboardLayout>
    ),
  },
  {
    path: "/my-projects",
    element: (
      <DashboardLayout pageTitle="پروژه‌های من">
        <MyProjects />
      </DashboardLayout>
    ),
  },
  {
    path: "/create-project",
    element: (
      <DashboardLayout pageTitle="ایجاد پروژه">
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
    path: "/my-projects/:projectId/requests",
    element: (
      <DashboardLayout pageTitle="درخواست‌های عضویت">
        <ProjectRequests />
      </DashboardLayout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
