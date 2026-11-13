import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import ExploreProjects from './pages/ExploreProjects';
import ProjectDetailsStub from './pages/ProjectDetailsStub';

// In your repo, add the two routes below to the existing router instead of replacing it.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/explore" replace /> },
  { path: '/explore', element: <ExploreProjects /> },
  { path: '/projects/:projectId', element: <ProjectDetailsStub /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
