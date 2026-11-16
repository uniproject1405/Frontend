import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import ExploreProjectCard from "./ExploreProjectCard";
import { getExploreProjects } from "../services/exploreService";

// Home-page strip: the 4 newest open projects (same card as Explore), plus a button to the explore page.
export default function NewestProjects({ exploreTo = "/explore" }) {
  const [newest, setNewest] = useState([]);

  useEffect(() => {
    let active = true;
    getExploreProjects({ status: "open" })
      .then((all) => {
        if (!active) return;
        const byDate = (p) => new Date(p.createdAt || 0);
        setNewest([...all].sort((a, b) => byDate(b) - byDate(a)).slice(0, 4));
      })
      .catch(() => active && setNewest([]));
    return () => { active = false; };
  }, []);

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          جدیدترین پروژه‌ها
        </Typography>
        <Button component={RouterLink} to={exploreTo} endIcon={<ArrowBackRoundedIcon />}>
          نمایش بیشتر
        </Button>
      </Stack>
      <Box sx={{ display: "grid", gap: 2.5, minHeight: 380, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>
        {newest.map((p) => <ExploreProjectCard key={p.id} project={p} />)}
      </Box>
    </Stack>
  );
}
