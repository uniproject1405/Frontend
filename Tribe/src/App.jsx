import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

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
