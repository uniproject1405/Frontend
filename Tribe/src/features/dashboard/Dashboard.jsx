import { Box, Typography } from "@mui/material";

import { useAuth } from "../auth/useAuth.js";
import { LogoutButton } from "../logout/index.js";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 800 }}>
        سلام {user?.username || user?.email || "دوست من"} 👋
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary" }}>
        این صفحه فقط برای کاربران واردشده است.
      </Typography>
      <LogoutButton />
    </Box>
  );
}
