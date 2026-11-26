import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import ExploreProjects from './pages/ExploreProjects';
import ProjectDetailsStub from './pages/ProjectDetailsStub';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import TermsPage from './pages/TermsPage.jsx';
import NotFound from './pages/NotFound.jsx';

// In your repo, add these routes to the existing router instead of replacing it.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/explore" replace /> },
  { path: '/explore', element: <ExploreProjects /> },
  { path: '/projects/:projectId', element: <ProjectDetailsStub /> },

  // فقط برای کاربران وارد‌نشده؛ کاربر واردشده به کاوش پروژه‌ها می‌رود
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
    ],
  },

  // همه می‌توانند ببینند
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/terms', element: <TermsPage /> },

  { path: '*', element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
