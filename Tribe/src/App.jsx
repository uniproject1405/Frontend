import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import DashboardLayout from "./layouts/DashboardLayout";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/create-project" replace />,
  },
  {
    path: "/my-projects",
    element: <Navigate to="/create-project" replace />,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;