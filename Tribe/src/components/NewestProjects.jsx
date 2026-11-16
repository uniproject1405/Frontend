import { Link as RouterLink } from "react-router";
import { Box, Button, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useStoredJson } from "../services/store";

const NONE = [];

// Home-page strip: the 4 newest open projects, plus a button to the explore page.
export default function NewestProjects({ exploreTo = "/explore" }) {
  const projects = useStoredJson("tribe_projects", NONE);
  const newest = projects
    .filter((p) => p.status === "open")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" component="h2" fontWeight={700}>
          جدیدترین پروژه‌ها
        </Typography>
        <Button component={RouterLink} to={exploreTo} endIcon={<ArrowBackRoundedIcon />}>
          نمایش بیشتر
        </Button>
      </Stack>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
        {newest.map((p) => (
          <Card key={p.id} sx={{ borderRadius: 3 }}>
            <CardActionArea component={RouterLink} to={`/projects/${p.id}`} sx={{ height: "100%" }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography fontWeight={700}>{p.title}</Typography>
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                    {(p.requiredSkills || []).slice(0, 3).map((s) => (
                      <Chip key={s} size="small" label={s} />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
