import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./features/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./features/auth/PublicOnlyRoute.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Signup from "./features/auth/pages/Signup.jsx";
import ForgotPassword from "./features/auth/pages/ForgotPassword.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import TermsPage from "./features/legal/TermsPage.jsx";
import NotFound from "./features/not-found/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* فقط برای کاربران وارد‌نشده؛ کاربر واردشده به داشبورد می‌رود */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* فقط برای کاربران واردشده؛ بقیه به /login می‌روند */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* همه می‌توانند ببینند */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* هر آدرس دیگر */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
