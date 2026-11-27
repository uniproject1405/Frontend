import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import ExploreProjectCard from "./ExploreProjectCard";
import { getExploreProjects } from "../services/exploreService";

function getCreatedAt(project) {
  const value =
    project.createdAt ??
    project.created_at ??
    project.createdOn ??
    project.created_at_date ??
    project.registrationDate;

  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function LatestProjects() {
  const sliderRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    // Use the same Explore service so the cards always reflect real service data.
    getExploreProjects()
      .then((data) => {
        if (!active) return;

        const newestFirst = [...data].sort(
          (a, b) => getCreatedAt(b) - getCreatedAt(a)
        );

        setProjects(newestFirst.slice(0, 4));
      })
      .catch((err) => {
        if (active) setError(err?.message || "دریافت پروژه‌ها با خطا مواجه شد.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.firstElementChild;
    if (!card) return;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    slider.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="section"
      dir="rtl"
      aria-labelledby="latest-projects-title"
      sx={{
        mt: 0,
        mb: 0,
        width: "100%",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          border: "1px solid #DBE5F0",
          borderRadius: { xs: 3, md: 4 },
          bgcolor: "#FFFFFF",
          p: { xs: 2, sm: 3, md: 3.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#071739",
                fontSize: { xs: 21, sm: 24 },
                fontWeight: 800,
                lineHeight: 1.6,
              }}
            >
              تازه‌رسیده‌ها
            </Typography>
            <Typography
              id="latest-projects-title"
              sx={{
                color: "#6E84A3",
                fontSize: { xs: 13, sm: 14 },
                mt: 0.4,
                lineHeight: 1.9,
              }}
            >
              تازه‌ترین پروژه‌هایی که اعضا ثبت کرده‌اند.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/explore"
            endIcon={<ArrowBackRoundedIcon />}
            sx={{
              color: "#1E4C9A",
              fontWeight: 700,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            مشاهده همه
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} sx={{ color: "#1E4C9A" }} />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && projects.length === 0 && (
          <Alert severity="info">
            هنوز پروژه‌ای برای نمایش ثبت نشده است.
          </Alert>
        )}

        {!loading && !error && projects.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mb: 2,
              }}
            >
              <IconButton
                aria-label="پروژه‌های قبلی"
                onClick={() => moveSlider(1)}
                sx={{
                  border: "1px solid #DBE5F0",
                  color: "#1E4C9A",
                }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>

              <IconButton
                aria-label="پروژه‌های بعدی"
                onClick={() => moveSlider(-1)}
                sx={{
                  border: "1px solid #DBE5F0",
                  color: "#1E4C9A",
                }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
            </Box>

            <Box
              ref={sliderRef}
              dir="rtl"
              sx={{
                display: "grid",
                gridAutoFlow: "column",
                gridAutoColumns: {
                  xs: "88%",
                  sm: "calc((100% - 20px) / 2)",
                  md: "calc((100% - 40px) / 3)",
                  xl: "calc((100% - 60px) / 4)",
                },
                gap: "20px",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                pb: 2,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {projects.map((project) => (
                <Box
                  key={project.id}
                  sx={{
                    minWidth: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <ExploreProjectCard project={project} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
