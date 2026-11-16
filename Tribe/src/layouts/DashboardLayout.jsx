import { NavLink } from "react-router";
import { Box, Chip, Container, Stack } from "@mui/material";

import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useNotifications } from "../services/notificationService";
import { useMyStats } from "../services/membershipService";
import { fa } from "../utils/fa";

const NAVY = "#071739";

const TABS = [
  ["پروژه‌های من", "/my-projects", true],
  ["ساخت پروژه", "/create-project"],
  ["اعلان‌ها", "/notifications", false, true],
  ["پروفایل", "/profile"],
];

// Signed-in shell: the same header + footer as the public pages, plus a light sub-nav.
// (Replaces the old dark sidebar so the whole site looks like one app.)
function DashboardLayout({ children }) {
  const stats = useMyStats();
  const { unread } = useNotifications();

  const statChips = [
    ["درخواست برای بررسی", stats.toReview, "/my-projects?tab=review", stats.toReview > 0],
    ["در انتظار پاسخ", stats.waiting, "/my-projects?tab=requests"],
    ["تیم‌های عضو شده", stats.joined, "/my-projects?tab=joined"],
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F8", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E3E8EF" }}>
        <Container maxWidth="lg">
          <Box component="nav" aria-label="بخش‌های داشبورد" sx={{ display: "flex", gap: 0.5, overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(([label, href, end, badge]) => (
              <Box
                key={href}
                component={NavLink}
                to={href}
                end={end}
                sx={{
                  px: 2, py: 1.5, flexShrink: 0, textDecoration: "none", fontSize: 15, color: "#4B6382",
                  borderBottom: "2px solid transparent", whiteSpace: "nowrap",
                  "&:hover": { color: NAVY },
                  "&.active": { color: NAVY, fontWeight: 700, borderBottomColor: NAVY },
                }}
              >
                {label}
                {badge && unread > 0 && (
                  <Box component="span" sx={{ ml: 1, px: 0.9, borderRadius: 10, bgcolor: "#B42318", color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: "18px", display: "inline-block" }}>
                    {unread > 99 ? "۹۹+" : fa(unread)}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap", mb: 3 }}>
          {statChips.map(([label, value, href, highlight]) => (
            <Chip
              key={label}
              component={NavLink}
              to={href}
              clickable
              label={`${label}: ${fa(value)}`}
              variant="outlined"
              sx={{ bgcolor: highlight ? "#E3C39D" : "#fff", color: NAVY, borderColor: highlight ? "#E3C39D" : "#E3E8EF", fontWeight: highlight ? 700 : 500 }}
            />
          ))}
        </Stack>
        {children}
      </Container>

      <SiteFooter />
    </Box>
  );
}

export default DashboardLayout;
