import { NavLink } from "react-router";
import { Box, Container } from "@mui/material";

import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useNotifications } from "../services/notificationService";
import { useChatList } from "../services/chatService";
import { fa } from "../utils/fa";

const NAVY = "#071739";

const TABS = [
  ["پروژه‌های من", "/my-projects", true],
  ["ساخت پروژه", "/create-project"],
  ["گفت‌وگو و مذاکره", "/chat", false, false, "chat"],
  ["اعلان‌ها", "/notifications", false, true],
  ["پروفایل", "/profile"],
];

// Signed-in shell: the same header + footer as the public pages, plus a light sub-nav.
// (Replaces the old dark sidebar so the whole site looks like one app.)
function DashboardLayout({ children }) {
  const { unread } = useNotifications();
  const { totalUnread } = useChatList();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F8", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E3E8EF" }}>
        <Container maxWidth="lg">
          <Box component="nav" aria-label="بخش‌های داشبورد" sx={{ display: "flex", gap: 0.5, overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(([label, href, end, badge, kind]) => (
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
                {kind === "chat" && totalUnread > 0 && (
                  <Box component="span" sx={{ ml: 1, px: 0.9, borderRadius: 10, bgcolor: "#071739", color: "#E3C39D", fontSize: 11, fontWeight: 700, lineHeight: "18px", display: "inline-block" }}>
                    {totalUnread > 99 ? "۹۹+" : fa(totalUnread)}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>

      <SiteFooter />
    </Box>
  );
}

export default DashboardLayout;
