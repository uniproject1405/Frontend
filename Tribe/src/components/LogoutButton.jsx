import { Button } from "@mui/material";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";

import { useLogout } from "../hooks/useLogout.js";

/*
  دکمه آماده خروج؛ در هر صفحه یا نوار بالایی بدون تنظیم قابل استفاده است.
  props اضافه (مثل size یا variant) به خود Button می‌رسد.
*/
export default function LogoutButton(props) {
  const logout = useLogout();

  return (
    <Button
      variant="outlined"
      startIcon={<LogoutOutlined />}
      onClick={logout}
      {...props}
    >
      خروج
    </Button>
  );
}
