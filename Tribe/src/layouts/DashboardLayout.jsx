import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  InputBase,
  Toolbar,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SiteFooter from "../components/SiteFooter";
import TribeLogo from "../components/TribeLogo";

const colors = {
  navy: "#071739",
  blue: "#4B6382",
  beige: "#A68868",
  border: "#E9EDF2",
  background: "#F3F7FC",
};

// Only paths verified in the current project are links.
// Do not guess teammates' route names: the other headings are display-only.
const navigationItems = [
  { label: "کاوش پروژه‌ها", path: null },
  { label: "پروژه‌های من", path: "/my-projects" },
  { label: "یافتن افراد", path: null },
  { label: "تبادل مهارت", path: null },
  { label: "راهنمای استفاده", path: null },
];

function DashboardLayout({ children, pageTitle = "داشبورد" }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isProjectsPage =
    location.pathname.startsWith("/my-projects") ||
    location.pathname === "/create-project";

  const renderNavItem = (item, mobile = false) => {
    const active = item.path === "/my-projects" && isProjectsPage;
    const commonSx = {
      display: "flex",
      alignItems: "center",
      justifyContent: mobile ? "flex-start" : "center",
      minHeight: mobile ? 42 : 40,
      px: mobile ? 2 : { lg: 1.1, xl: 1.6 },
      py: mobile ? 1 : 0.6,
      borderRadius: "8px",
      color: active ? colors.navy : "#53657A",
      fontWeight: active ? 750 : 500,
      fontSize: { xs: 13, lg: 12.5, xl: 13.5 },
      textDecoration: "none",
      whiteSpace: "nowrap",
      backgroundColor: "transparent",
      transition: "color .18s ease, background-color .18s ease",
    };

    if (!item.path) {
      return (
        <Box key={item.label} component="span" sx={{ ...commonSx, cursor: "default" }}>
          {item.label}
        </Box>
      );
    }

    return (
      <Box
        key={item.label}
        component={Link}
        to={item.path}
        aria-current={active ? "page" : undefined}
        onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        sx={{
          ...commonSx,
          cursor: "pointer",
          "&:hover": { color: colors.navy, bgcolor: "#F4F6F9" },
          ...(active ? { "&::after": mobile ? {} : {
            content: '""', position: "absolute", bottom: 13, height: 2,
            bgcolor: colors.beige, borderRadius: 2,
          }} : {}),
          position: "relative",
        }}
      >
        {item.label}
      </Box>
    );
  };

  return (
    <Box
      dir="rtl"
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #F5F9FD 0%, #EAF3FB 55%, #F3F7FC 100%)",
        color: colors.navy,
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          color: colors.navy,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: "0 2px 12px rgba(7, 23, 57, 0.025)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: "66px !important", md: "78px !important" },
            width: "100%",
            maxWidth: "1536px",
            mx: "auto",
            boxSizing: "border-box",
            px: { xs: 2, sm: 3, lg: 5, xl: 6 },
            gap: { xs: 1, lg: 1.5, xl: 2 },
          }}
        >
          {/* Compact Tribe brand, modeled on the supplied navbar reference. */}
          <Box
              component={Link}
              to="/my-projects"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                flexShrink: 0,
                mr: { xs: 0, lg: 2.5, xl: 4 },
              }}
            >
              <TribeLogo />
            </Box>

          {/* Full-width, flat desktop navigation: no sidebar or colored pill. */}
          <Box component="nav" aria-label="منوی اصلی"
            sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center",
              gap: { lg: 0, xl: 0.5 }, flexGrow: 1, minWidth: 0 }}>
            {navigationItems.map((item) => renderNavItem(item))}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, lg: 0 } }} />

          {/* Existing search, notifications and account remain visible. */}
          <Box sx={{ display: "flex", alignItems: "center",
            gap: { xs: 0.25, sm: 0.75, xl: 1.2 }, flexShrink: 0 }}>
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center",
              height: 36, width: { md: 115, xl: 158 }, gap: 0.7, px: 1,
              border: `1px solid ${colors.border}`, bgcolor: "#FBFCFE", borderRadius: "8px" }}>
              <SearchRoundedIcon sx={{ fontSize: 18, color: colors.blue }} />
              <InputBase disabled placeholder="جست‌وجو..." inputProps={{ "aria-label": "جست‌وجو" }}
                sx={{ width: "100%", fontSize: 11.5,
                  "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: colors.blue, opacity: 0.65 } }} />
            </Box>
            <IconButton disabled aria-label="اعلان‌ها" sx={{
              color: colors.navy,
              "&.Mui-disabled": { color: colors.navy },
            }}>
              <Badge variant="dot" color="primary" invisible>
                <NotificationsNoneRoundedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5,
              pl: { xs: 0.3, sm: 1.2 }, borderLeft: { sm: `1px solid ${colors.border}` } }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: "#E2EAF3", color: colors.navy,
                border: "1px solid #D4DEE9", fontSize: 11, fontWeight: 700 }}>ک</Avatar>
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: colors.blue,
                display: { xs: "none", sm: "block" } }} />
            </Box>
            <IconButton
              aria-label={mobileMenuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((value) => !value)}
              sx={{ display: { xs: "inline-flex", lg: "none" }, color: colors.navy }}
            >
              {mobileMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Box>
        </Toolbar>
        {mobileMenuOpen && (
          <Box component="nav" aria-label="منوی موبایل"
            sx={{ display: { xs: "flex", lg: "none" }, flexDirection: "column",
              p: 1.5, bgcolor: "#FFFFFF", borderTop: `1px solid ${colors.border}` }}>
            {navigationItems.map((item) => renderNavItem(item, true))}
          </Box>
        )}
      </AppBar>

      <Box component="main" aria-label={pageTitle}
        sx={{ width: "100%", flex: 1, boxSizing: "border-box",
          px: { xs: 2, sm: 3, md: 4, lg: 4 }, pt: { xs: 3.5, md: 4 }, pb: 6 }}>
        <Container maxWidth={false} disableGutters sx={{ maxWidth: "1600px", mx: "auto" }}>
          {children}
        </Container>
      </Box>

      {/* Shared team footer, displayed below the page content. */}
      <SiteFooter />
    </Box>
  );
}

export default DashboardLayout;
