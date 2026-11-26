import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import NewestProjects from "../components/NewestProjects";
import NetworkTrustSection from "../components/NetworkTrustSection";
import LatestProjects from "../components/LatestProjects";
import ProjectCallout from "../components/ProjectCallout";
import HowTribeWorks from "../components/HowTribeWorks";
import heroNetworkImage from "../assets/tribe-home-hero-network.jpg";

const COLORS = {
  navy: "#071739",
  blue: "#4B6382",
  beige: "#E3C39D",
  paleBlue: "#EEF4FC",
  softBlue: "#DCE8F7",
  border: "#DBE5F0",
  textSoft: "#6E84A3",
  white: "#FFFFFF",
  bg: "#F9FBFE",
};

const stats = [
  { value: "۱۹۰۰", label: "هم‌تیمی" },
  { value: "۴۸", label: "شهر" },
  { value: "۳۱۲", label: "پروژه انجام‌شده" },
];

const categories = [
  "طراحی محصول",
  "برنامه‌نویسی",
  "برندینگ",
  "رشد",
  "تحقیق",
  "نویسندگی",
  "صوت",
  "فیلم",
  "داده",
];

export default function Home() {
  return (
    <Box
      dir="rtl"
      sx={{
        direction: "rtl",
        textAlign: "right",
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 5, md: 7 },
        fontFamily: '"Vazirmatn", sans-serif',
      }}
    >
      <Box
        component="section"
        sx={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "24px",
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          pt: { xs: 3, sm: 4, md: 4 },
          pb: { xs: 3, sm: 4, md: 4 },
          overflow: "hidden",
        }}
      >
        {/* top badge */}
        <Chip
          icon={
            <AutoAwesomeRoundedIcon
              sx={{
                color: "#1E4C9A !important",
                fontSize: 17,
                mr: 0,
                ml: 0.75,
              }}
            />
          }
          label="۴۲ پروژه در جست‌وجوی هم‌تیمی"
          sx={{
            mb: 3,
            ml: "auto",
            mr: 0,
            display: "flex",
            width: "fit-content",
            height: 34,
            direction: "rtl",
            bgcolor: COLORS.paleBlue,
            color: COLORS.navy,
            borderRadius: "999px",
            fontWeight: 700,
            border: `1px solid ${COLORS.border}`,
            "& .MuiChip-label": {
              px: 1.5,
              fontSize: "13px",
              lineHeight: 1.7,
            },
            "& .MuiChip-icon": {
              marginInlineStart: "10px",
              marginInlineEnd: 0,
            },
          }}
        />

        {/* hero */}
        <Box
          sx={{
            display: "grid",
            // RTL grid: Persian content on the RIGHT, visual on the LEFT.
            direction: "rtl",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 1fr) minmax(0, 1fr)",
            },
            gridTemplateAreas: {
              xs: `"content" "visual"`,
              md: `"visual content"`,
            },
            gap: { xs: 4, md: 3, lg: 6 },
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* right text in RTL visual flow */}
          <Box
            dir="rtl"
            sx={{
              gridArea: "content",
              direction: "rtl",
              textAlign: "right",
              minWidth: 0,
              width: "100%",
              justifySelf: "stretch",
              unicodeBidi: "plaintext",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              component="h1"
              dir="rtl"
              sx={{
                direction: "rtl",
                textAlign: "right",
                m: 0,
                color: COLORS.navy,
                fontWeight: 800,
                lineHeight: 1.32,
                letterSpacing: 0,
                fontSize: {
                  xs: "34px",
                  sm: "44px",
                  md: "52px",
                  lg: "56px",
                },
                width: "100%",
                maxWidth: "650px",
                ml: "auto",
              }}
            >
              هم‌تیمی‌های هم‌مسیرت را پیدا کن؛
              <Box component="span" sx={{ display: "block" }}>
                با هم،{" "}
                <Box
                  component="span"
                  sx={{ color: "#1E4C9A", display: "inline" }}
                >
                  ایده‌های بزرگ
                </Box>{" "}
                بساز.
              </Box>
            </Typography>

            <Typography
              dir="rtl"
              sx={{
                direction: "rtl",
                textAlign: "right",
                mt: 2.5,
                width: "100%",
                maxWidth: "610px",
                ml: "auto",
                color: COLORS.blue,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                lineHeight: 2.15,
                unicodeBidi: "plaintext",
              }}
            >
              در ترایب، ایده‌ات را با افرادی همراه کن که مهارت و انگیزه‌ی
              پیش‌بردنش را دارند؛ از اولین گفت‌وگو و تقسیم نقش‌ها تا ساختن
              نتیجه‌ای واقعی و ارزشمند.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                mt: 4,
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "flex-start",
                direction: "rtl",
                alignSelf: "flex-end",
                columnGap: 1.25,
                rowGap: 1.25,
                "& .MuiButton-endIcon": {
                  margin: 0,
                  marginInlineStart: "9px",
                },
              }}
            >
              <Button
                component={Link}
                to="/create-project"
                variant="contained"
                endIcon={<ArrowBackRoundedIcon sx={{ color: "#071739" }} />}
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: "999px",
                  bgcolor: "#071739",
                  color: COLORS.white,
                  fontWeight: 800,
                  fontSize: "14px",
                  boxShadow: "0 10px 24px rgba(30,76,154,0.20)",
                  "&:hover": {
                    bgcolor: "#5c7092",
                    boxShadow: "0 10px 24px rgba(149, 169, 203, 0.24)",
                  },
                }}
              >
                 ورود / ثبت نام 
              </Button>

              <Button
                variant="outlined"
                sx={{
                  minHeight: 52,
                  px: 3.2,
                  borderRadius: "999px",
                  color: COLORS.navy,
                  borderColor: COLORS.border,
                  fontWeight: 700,
                  fontSize: "14px",
                  bgcolor: COLORS.white,
                  "&:hover": {
                    borderColor: "#C7D6E8",
                    bgcolor: "#FAFCFF",
                  },
                }}
              >
                مشاهده تبادل مهارت
              </Button>
            </Stack>

            {/* mini social + stats */}
            <Box
              sx={{
                mt: 4,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: { xs: 2, md: 3 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {["م", "س", "ا"].map((item, index) => (
                    <Box
                      key={item + index}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        bgcolor: index === 0 ? "#f6d5b5" : index === 1 ? "#A9BDD8" : "#bca487",
                        color: COLORS.navy,
                        fontSize: "12px",
                        fontWeight: 800,
                        display: "grid",
                        placeItems: "center",
                        border: "2px solid white",
                        ml: index === 0 ? 0 : -1,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>

                <Typography
                  sx={{
                    color: COLORS.textSoft,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  پیوستن به بیش از ۱۹۰۰ هم‌تیمی
                </Typography>
              </Box>

              <Stack direction="row" spacing={{ xs: 2.5, sm: 3.5 }}>
                {stats.map((item) => (
                  <Box key={item.label}>
                    <Typography
                      sx={{
                        color: "#1E4C9A",
                        fontWeight: 800,
                        fontSize: { xs: "22px", sm: "24px" },
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.8,
                        color: COLORS.textSoft,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* visual placeholder */}
          <Box
            sx={{
              gridArea: "visual",
              direction: "rtl",
              minWidth: 0,
              width: "100%",
              justifySelf: "stretch",
              position: "relative",
              minHeight: { xs: 300, sm: 360, md: 420, lg: 470 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* soft background block */}
            <Box
              sx={{
                position: "absolute",
                inset: { xs: "10px", sm: "16px", md: "20px" },
                borderRadius: "28px",
                bgcolor: "#f6f4f2",
              }}
            />

            {/* top/right abstract shapes */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 0, md: -16 },
                right: { xs: 24, md: 40 },
                width: { xs: 90, md: 120 },
                height: { xs: 28, md: 36 },
                borderRadius: "0 0 18px 18px",
                bgcolor: "#e1e6ec",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: { xs: 8, md: 18 },
                bottom: { xs: 36, md: 52 },
                width: { xs: 56, md: 72 },
                height: { xs: 56, md: 72 },
                borderRadius: "18px",
                bgcolor: "#d8cdbd",
                opacity: 0.55,
              }}
            />

            {/* hero image */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                width: { xs: "78%", sm: "72%", md: "75%" },
                aspectRatio: "1 / 1",
                bgcolor: COLORS.white,
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(7, 23, 57, 0.06)",
              }}
            >
              <Box
                component="img"
                src={heroNetworkImage}
                alt="شبکه همکاری ترایب"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* floating status card */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: 16, md: 0 },
                bottom: { xs: 8, md: 18 },
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                bgcolor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "18px",
                px: 1.5,
                py: 1.2,
                boxShadow: "0 12px 24px rgba(7, 23, 57, 0.08)",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "12px",
                  bgcolor: "#dfe8f0",
                  color: "#071739",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 19 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: COLORS.navy,
                    fontWeight: 800,
                    fontSize: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  ۱۲۸ عضو آنلاین
                </Typography>
                <Typography
                  sx={{
                    color: COLORS.textSoft,
                    fontSize: "11px",
                    lineHeight: 1.5,
                  }}
                >
                  همین حالا در حال همکاری روی پروژه‌ها
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* animated category strip — matched to the reference layout */}
        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            overflow: "hidden",
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            py: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "max-content",
              whiteSpace: "nowrap",
              animation: "tribeCategoryMarquee 30s linear infinite",
              "@keyframes tribeCategoryMarquee": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-33.333333%)" },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
                whiteSpace: "normal",
              },
            }}
          >
            {[0, 1, 2].map((group) => (
              <Box
                key={group}
                aria-hidden={group === 0 ? undefined : "true"}
                sx={{
                  display: "flex",
                  flex: "0 0 auto",
                  alignItems: "center",
                  gap: 4,
                  pr: 4,
                  direction: "rtl",
                }}
              >
                {categories.map((item, index) => (
                  <Box
                    key={`${group}-${item}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      flex: "0 0 auto",
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: "rgba(110, 132, 163, 0.72)",
                      }}
                    >
                      {item}
                    </Typography>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        bgcolor: "rgba(30, 76, 154, 0.25)",
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Browse by category — Persian RTL adaptation of the supplied reference */}
      <Box
        component="section"
        aria-labelledby="category-section-title"
        sx={{
          mt: 0,
          width: "100%",
          maxWidth: "1360px",
          mx: "auto",
          px: { xs: 1, sm: 1.5, md: 2 },
          pb: 0,
          boxSizing: "border-box",
          direction: "rtl",
        }}
      >
        <Box
          dir="rtl"
          sx={{
            display: "flex",
            direction: { xs: "rtl", sm: "ltr" },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: { xs: 2, md: 2.5 },
            textAlign: "right",
          }}
        >
          <Box dir="rtl" sx={{ direction: "rtl", textAlign: { xs: "right", sm: "left" }, minWidth: 0 }}>
            <Typography
              dir="rtl"
              sx={{
                direction: "rtl",
                textAlign: { xs: "right", sm: "left" },
                color: "#1E4C9A",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: 0,
                mb: 1.5,
              }}
            >
              دسته‌بندی‌ها را مرور کنید
            </Typography>
            <Typography
              id="category-section-title"
              component="h2"
              dir="rtl"
              sx={{
                direction: "rtl",
                textAlign: { xs: "right", sm: "left" },
                color: "#111827",
                fontSize: { xs: "26px", sm: "30px", md: "38px" },
                lineHeight: 1.35,
                fontWeight: 900,
                letterSpacing: 0,
                m: 0,
              }}
            >
              مشاهده همه پروژه‌ها
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/projects"
            variant="text"
            dir="rtl"
            endIcon={<ArrowBackRoundedIcon />}
            sx={{
              direction: "rtl",
              alignSelf: { xs: "flex-start", sm: "center" },
              flexShrink: 0,
              color: "#173F91",
              fontSize: "15px",
              fontWeight: 700,
              px: 0,
              minWidth: 0,
              "&:hover": { bgcolor: "transparent", color: "#2458B5" },
            }}
          >
            پروژه‌های خوب، فرصت‌های بزرگ
          </Button>
        </Box>

        <Box
          dir="rtl"
          sx={{
            display: "grid",
            direction: "ltr",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {[
            {
              title: "طراحی محصول",
              description: "پیش از ساخت، شکل محصول را مشخص کنید. رابط‌ها، مسیرهای کاربری و جزئیاتی که تجربه‌ای بهتر می‌سازند.",
              members: "۴۱۲ عضو",
              Icon: DesignServicesOutlinedIcon,
            },
            {
              title: "مهندسی و توسعه",
              description: "با افرادی همراه شوید که به کیفیت اهمیت می‌دهند و نرم‌افزارهای واقعی و کاربردی می‌سازند.",
              members: "۳۸۶ عضو",
              Icon: CodeRoundedIcon,
            },
            {
              title: "رشد و داستان‌پردازی",
              description: "ایده‌ها را به حرکت تبدیل کنید؛ از جایگاه‌سازی و تولید محتوا تا جذب اولین همراهان برند.",
              members: "۲۷۱ عضو",
              Icon: TrendingUpRoundedIcon,
            },
            {
              title: "پژوهش و برندینگ",
              description: "واقعیت را کشف کنید و به آن هویت بدهید؛ از مصاحبه و تحقیق تا ساخت و نام‌گذاری برند.",
              members: "۱۹۸ عضو",
              Icon: AutoAwesomeRoundedIcon,
            },
          ].map(({ title, description, members, Icon }) => (
            <Box
              key={title}
              dir="rtl"
              sx={{
                minHeight: { xs: 225, md: 285 },
                p: { xs: 2, md: 2.5 },
                border: "1px solid #DBE5F0",
                borderRadius: "20px",
                bgcolor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                direction: "rtl !important",
                textAlign: "right !important",
                alignItems: "stretch",
                justifyContent: "flex-start",
                '&, & *': { boxSizing: "border-box" },
                transition: "border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                "&:hover": {
                  borderColor: "#B9CBE3",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 28px rgba(7, 23, 57, 0.055)",
                },
              }}
            >
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  borderRadius: "16px",
                  bgcolor: "#EFF5FD",
                  color: "#071739",
                  display: "grid",
                  placeItems: "center",
                  mb: 2.2,
                  marginRight: 0,
                  marginLeft: "auto",
                }}
              >
                <Icon sx={{ fontSize: 27 }} />
              </Box>

              <Typography
                component="h3"
                sx={{
                  color: "#111827",
                  fontSize: { xs: "17px", md: "19px" },
                  fontWeight: 800,
                  mb: 1.2,
                  width: "100%",
                  display: "block",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  alignSelf: "stretch",
                  marginRight: 0,
                  marginLeft: "auto",
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "#58708F",
                  fontSize: { xs: "13px", md: "14px" },
                  lineHeight: 2.05,
                  flexGrow: 1,
                  width: "100%",
                  display: "block",
                  direction: "rtl !important",
                  textAlign: "right !important",
                  alignSelf: "stretch",
                  marginRight: 0,
                  marginLeft: "auto",
                  unicodeBidi: "isolate",
                }}
              >
                {description}
              </Typography>

              <Box
                sx={{
                  mt: 1.8,
                  pt: 1.5,
                  borderTop: "1px solid #DBE5F0",
                  display: "flex",
                  direction: "rtl !important",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: 0,
                  marginLeft: "auto",
                  gap: 1,
                  width: "100%",
                  color: "#607795",
                  textAlign: "right",
                }}
              >
                <GroupsOutlinedIcon sx={{ fontSize: 19, color: "#8CA4C8" }} />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    direction: "rtl !important",
                    textAlign: "right !important",
                  }}
                >
                  {members}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Project carousel — after the category cards */}
      <NewestProjects />

      {/* Network section — directly after the project cards */}
      <NetworkTrustSection />
      <ProjectCallout />
      <LatestProjects />
      <HowTribeWorks />

    </Box>
  );
}