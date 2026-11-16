import { Link as RouterLink } from "react-router";
import { Button, Stack, Typography } from "@mui/material";

import PublicLayout from "../layouts/PublicLayout";
import NewestProjects from "../components/NewestProjects";

// Front page: short intro + the newest projects. Banners (Mabina's card) go above the strip.
export default function Home() {
  return (
    <PublicLayout>
      <Stack spacing={5}>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography variant="h4" component="h1" fontWeight={800}>
            هم‌تیمی مناسب پروژه‌ات را پیدا کن
          </Typography>
          <Button component={RouterLink} to="/explore" variant="contained">
            کاوش پروژه‌ها
          </Button>
        </Stack>
        <NewestProjects />
      </Stack>
    </PublicLayout>
  );
}
