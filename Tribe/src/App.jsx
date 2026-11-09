import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./layouts/DashboardLayout";
import MyProjects from "./pages/MyProjects";
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