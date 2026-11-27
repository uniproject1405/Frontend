import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function ProjectCallout() {
  return (
    <Box
      component="section"
      dir="rtl"
      sx={{
        my: 0,
        width: "100%",
        minHeight: { xs: 176, md: 166 },
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 2, md: 4 },
        px: { xs: 2.5, sm: 4, md: 5 },
        py: { xs: 2.5, md: 3 },
        borderRadius: { xs: 3, md: 4 },
        background: "linear-gradient(112deg, #071739 0%, #102B5A 100%)",
        color: "#FFFFFF",
        border: "1px solid rgba(30,76,154,0.22)",
        "&::before": {
          content: '""',
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          left: { xs: -115, md: "35%" },
          top: -145,
          background: "rgba(227,195,157,0.09)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          right: { xs: -90, md: "18%" },
          bottom: -112,
          border: "1px solid rgba(227,195,157,0.2)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack
        spacing={1.1}
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          alignItems: "flex-start",
          textAlign: "right",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 21, sm: 25, md: 28 },
            lineHeight: 1.5,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          ایده‌ات شایسته یک تیم خوبه.
        </Typography>

        <Typography
          sx={{
            maxWidth: 650,
            color: "#C7D2E3",
            fontSize: { xs: 13, sm: 14, md: 15 },
            lineHeight: 1.9,
          }}
        >
          آدم‌های مناسب را پیدا کن، تیمت را بساز و ایده‌ات را به یک پروژه واقعی
          تبدیل کن.
        </Typography>

        <Button
          component={Link}
          to="/create-project"
          variant="contained"
          endIcon={<ArrowBackRoundedIcon />}
          sx={{
            mt: 0.8,
            px: 2.6,
            py: 1.1,
            borderRadius: 99,
            bgcolor: "#E3C39D",
            color: "#071739",
            fontWeight: 800,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#D6B088",
              boxShadow: "none",
            },
          }}
        >
          ساخت پروژه
        </Button>
      </Stack>

      <Box
        aria-hidden="true"
        sx={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
          width: { xs: 72, sm: 94, md: 112 },
          height: { xs: 72, sm: 94, md: 112 },
          display: "grid",
          placeItems: "center",
          mr: { xs: 0, md: 3 },
          borderRadius: "26px",
          color: "#E3C39D",
          bgcolor: "rgba(30,76,154,0.22)",
          border: "1px solid rgba(227,195,157,0.22)",
          transform: "rotate(-7deg)",
          "& svg": {
            fontSize: { xs: 40, sm: 50, md: 58 },
            filter: "drop-shadow(0 7px 10px rgba(0,0,0,0.2))",
          },
        }}
      >
        <RocketLaunchRoundedIcon />
      </Box>
    </Box>
  );
}
