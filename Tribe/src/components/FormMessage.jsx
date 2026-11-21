import { Alert } from "@mui/material";

// پیام خطا یا اطلاع؛ بالای دکمه اصلی فرم قرار می‌گیرد
export default function FormMessage({ message, type = "error" }) {
  if (!message) return null;

  return (
    <Alert severity={type} className="auth-message" role="alert">
      {message}
    </Alert>
  );
}
