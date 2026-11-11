import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./layouts/DashboardLayout";
import MyProjects from "./pages/MyProjects";
import ProjectRequests from "./pages/ProjectRequests";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import ProjectDetails from "./pages/ProjectDetails";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/my-projects" replace /> },
  {
    path: "/my-projects",
    element: (
      <DashboardLayout pageTitle="My Projects">
        <MyProjects />
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
    path: "/projects/:projectId",
    element: (
      <DashboardLayout pageTitle="Project">
        <ProjectDetails />
      </DashboardLayout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
