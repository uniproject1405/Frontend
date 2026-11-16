import { Link as RouterLink } from "react-router";
import { Button, Card, Stack, Typography } from "@mui/material";

import NewestProjects from "../components/NewestProjects";
import { useAuth } from "../features/auth/useAuth.js";

// Front page: hero panel + the newest projects.
export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <Stack spacing={5}>
      <Card variant="outlined" sx={{ borderRadius: 3, p: { xs: 3, md: 6 }, textAlign: "center" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#071739", lineHeight: 1.6 }}>
          هم‌تیمی مناسب پروژه‌ات را پیدا کن
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          پروژه‌های باز را ببین، درخواست عضویت بده یا پروژه خودت را بساز.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center", alignItems: "center" }}>
          <Button component={RouterLink} to="/explore" variant="contained">کاوش پروژه‌ها</Button>
          <Button component={RouterLink} to={isAuthenticated ? "/create-project" : "/signup"} variant="outlined">
            {isAuthenticated ? "ساخت پروژه" : "عضویت در Tribe"}
          </Button>
        </Stack>
      </Card>
      <NewestProjects />
    </Stack>
  );
}
