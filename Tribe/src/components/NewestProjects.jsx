import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import ExploreProjectCard from "./ExploreProjectCard";
import { getExploreProjects } from "../services/exploreService";

export default function NewestProjects() {
  const sliderRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getExploreProjects({ status: "open" })
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
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

    const gap = parseFloat(
      window.getComputedStyle(slider).columnGap
    ) || 0;

    slider.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <Box
      component="section"
      dir="rtl"
      sx={{
        mt: 0,
        mb: 0,
        width: "100%",
        minWidth: 0,
        textAlign: "start",
      }}
    >
      {/* Section heading */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#1E4C9A",
              fontSize: 13,
              fontWeight: 700,
              mb: 1,
            }}
          >
            فرصت‌های همکاری
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 24, md: 34 },
              fontWeight: 800,
              color: "#071739",
            }}
          >
            پروژه‌هایی که دنبال آدم خودشون هستند
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1, lineHeight: 1.9 }}
          >
            پروژه‌های جذاب را کشف کن و با آدم‌هایی که
            هدف مشترکی با تو دارند، همراه شو.
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
          }}
        >
          مشاهده همه
        </Button>
      </Box>

      {/* Loading and error */}
      {loading && <CircularProgress size={28} />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && projects.length === 0 && (
        <Alert severity="info">
          در حال حاضر پروژه‌ای برای همکاری وجود ندارد.
        </Alert>
      )}

      {/* Slider controls */}
      {projects.length > 0 && (
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
              aria-label="پروژه قبلی"
              onClick={() => moveSlider(1)}
              sx={{ border: "1px solid #DBE5F0" }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>

            <IconButton
              aria-label="پروژه بعدی"
              onClick={() => moveSlider(-1)}
              sx={{ border: "1px solid #DBE5F0" }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          </Box>

          {/* Horizontal project cards */}
          <Box
            ref={sliderRef}
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
  );
}