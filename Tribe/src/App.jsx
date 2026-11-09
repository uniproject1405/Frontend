
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/my-projects" replace />,
  },
  {
    path: "/my-projects",
    element: (
      <DashboardLayout pageTitle="My Projects">
        <MyProjects />
      </DashboardLayout>
    ),
  },
  {
    path: "/create-project",
    element: (
      <DashboardLayout pageTitle="Create Project">
        <CreateProject />
      </DashboardLayout>
    ),
  },
  {
    path: "/my-projects/:projectId/edit",
    element: (
      <DashboardLayout pageTitle="Edit Project">
        <EditProject />
      </DashboardLayout>
    ),
  },
  {
    path: "/my-projects/:projectId/requests",
    element: (
      <DashboardLayout pageTitle="Project Requests">
        <ProjectRequests />
      </DashboardLayout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
