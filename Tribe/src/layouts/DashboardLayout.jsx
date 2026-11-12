
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useNotifications, markAllRead, markRead } from "../services/notificationService";
import NotificationRow from "../components/NotificationRow";
import { getProfile, PROFILE_KEY } from "../services/currentUser";
import { useMyStats } from "../services/membershipService";
import { useStoredJson } from "../services/store";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  Menu,
  MenuItem,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const drawerWidth = 260;

const menuItems = [
  {
    title: "پروژه‌های من",
    icon: <FolderRoundedIcon />,
    href: "/my-projects",
  },
  {
    title: "ساخت پروژه",
    icon: <AddCircleOutlineRoundedIcon />,
    href: "/create-project",
  },
  {
    title: "اعلان‌ها",
    icon: <NotificationsNoneRoundedIcon />,
    href: "/notifications",
    badge: true,
  },
  {
    title: "پروفایل",
    icon: <PersonRoundedIcon />,
    href: "/profile",
  },
];

const EMPTY = {};

function DashboardLayout({ children, pageTitle = "داشبورد" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellAnchor, setBellAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const navigate = useNavigate();
  useStoredJson(PROFILE_KEY, EMPTY);
  const profile = getProfile();
  const { items: notes, unread } = useNotifications();
  const stats = useMyStats();
  const unreadLabel = unread > 99 ? "99+" : unread;
  const location = useLocation();

  const sidebar = (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "#071739",
        color: "#FFFFFF",
        px: 2,
        py: 3,
      }}
    >
      <Box sx={{ px: 2, mb: 5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: "-1px",
            color: "#FFFFFF",
          }}
        >
          Tribe.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />

      <List sx={{ display: "grid", gap: 1 }}>
        {menuItems.map((item) => (
          
<ListItemButton
  key={item.title}
  component={NavLink}
  to={item.href}
  onClick={() => setMobileOpen(false)}
  sx={{
    borderRadius: "12px",
    color:
      location.pathname === item.href
        ? "#FFFFFF"
        : "#CDD5DB",
    bgcolor:
      location.pathname === item.href
        ? "rgba(255,255,255,0.14)"
        : "transparent",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.09)",
      color: "#FFFFFF",
    },
  }}
>
  <ListItemIcon sx={{ minWidth: 42, color: "inherit" }}>
    {item.icon}
  </ListItemIcon>

  <ListItemText primary={item.title} />
  {item.badge && unread > 0 && (
    <Box component="span" sx={{ bgcolor: "#E3C39D", color: "#071739", borderRadius: 10, px: 0.9, fontSize: 11, fontWeight: 700, lineHeight: "18px" }}>
      {unreadLabel}
    </Box>
  )}
</ListItemButton>

        ))}
      </List>

      <Typography variant="overline" sx={{ display: "block", color: "#A4B5C4", px: 2, mt: 4, mb: 0.5 }}>
        فعالیت شما
      </Typography>
      <List dense sx={{ display: "grid", gap: 0.5 }}>
        {[
          ["درخواست‌های در انتظار بررسی", stats.toReview, "/my-projects?tab=review"],
          ["در انتظار پاسخ", stats.waiting, "/my-projects?tab=requests"],
          ["تیم‌هایی که عضو شده‌اید", stats.joined, "/my-projects?tab=joined"],
        ].map(([label, value, href]) => (
          <ListItemButton
            key={label}
            component={NavLink}
            to={href}
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: "10px", color: "#CDD5DB", "&:hover": { bgcolor: "rgba(255,255,255,0.09)", color: "#FFFFFF" } }}
          >
            <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: 14 } } }} />
            <Box component="span" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: label === "درخواست‌های در انتظار بررسی" && value > 0 ? "#E3C39D" : "#FFFFFF" }}>
              {value}
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.92)",
          color: "#071739",
          borderBottom: "1px solid #CDD5DB",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, sm: 60 }, px: { xs: 1.5, sm: 2.5 } }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
            aria-label="باز کردن منو"
          >
            <MenuRoundedIcon />
          </IconButton>

          <Typography variant="subtitle1" sx={{ flexGrow: 1, minWidth: 0, fontWeight: 600, fontSize: { xs: 14, sm: 15 } }}>
            {pageTitle}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1 },
              flexShrink: 0,
            }}
          >
            {/* Visual notification control; connect to the notifications feature when its API is available. */}
            <Box
              component="button"
              type="button"
              aria-label="اعلان‌ها"
              onClick={(event) => setBellAnchor(event.currentTarget)}
              sx={{
                cursor: "pointer",
                p: 0,
                "&:hover": { bgcolor: "#E8EDF3" },
                "&:focus-visible": { outline: "2px solid #071739", outlineOffset: 2 },
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                border: "1px solid #CDD5DB",
                borderRadius: "8px",
                bgcolor: "#F5F8FA",
                color: "#071739",
                position: "relative",
              }}
            >
              <Badge
                badgeContent={unread}
                max={99}
                color="error"
                overlap="circular"
                sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 16, height: 16, px: 0.5 } }}
              >
                <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />
              </Badge>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.25, borderColor: "#CDD5DB" }}
            />

            <Box
              component="button"
              type="button"
              aria-label="منوی حساب"
              onClick={(event) => setUserAnchor(event.currentTarget)}
              sx={{
                cursor: "pointer",
                border: 0,
                bgcolor: "transparent",
                font: "inherit",
                textAlign: "left",
                "&:hover": { bgcolor: "#F0F3F8" },
                "&:focus-visible": { outline: "2px solid #071739", outlineOffset: 2 },
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                minWidth: 0,
                px: { xs: 0, sm: 0.75 },
                py: 0.25,
                borderRadius: "8px",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#F0F3F8",
                  color: "#071739",
                  border: "1px solid #CDD5DB",
                  width: 30,
                  height: 30,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {profile.name[0]}
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#071739", lineHeight: 1.2, fontSize: 11.5 }}
                >
                  {profile.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", lineHeight: 1.2, fontSize: 9.5 }}
                >
                  {stats.toReview > 0 ? `${stats.toReview} درخواست برای بررسی` : profile.headline || "حساب کاربری"}
                </Typography>
              </Box>

              <KeyboardArrowDownRoundedIcon
                sx={{ color: "#4B6382", fontSize: 17, display: { xs: "none", sm: "block" } }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={bellAnchor}
        open={Boolean(bellAnchor)}
        onClose={() => setBellAnchor(null)}
        slotProps={{ paper: { sx: { width: 360, maxWidth: "calc(100vw - 24px)" } } }}
      >
        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700 }}>اعلان‌ها</Typography>
          <Box component="button" type="button" disabled={unread === 0} onClick={markAllRead} sx={{ all: "unset", cursor: "pointer", fontSize: 13, color: "#071739", textDecoration: "underline", "&[disabled]": { opacity: 0.4, cursor: "default" } }}>
            خواندن همه
          </Box>
        </Box>
        <Divider />
        {notes.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>اعلان تازه‌ای ندارید</Typography>
        )}
        {notes.slice(0, 5).map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            dense
            onOpen={(x) => { markRead(x.id); setBellAnchor(null); navigate(x.link || "/my-projects"); }}
          />
        ))}
        <Divider />
        <MenuItem onClick={() => { setBellAnchor(null); navigate("/notifications"); }} sx={{ justifyContent: "center", fontWeight: 600 }}>
          مشاهده همه {notes.length > 0 ? `(${notes.length})` : ""}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={() => setUserAnchor(null)}
        slotProps={{ paper: { sx: { width: 280, maxWidth: "calc(100vw - 24px)" } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>{profile.name}</Typography>
          {profile.headline && <Typography variant="body2" color="text.secondary">{profile.headline}</Typography>}
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {stats.created} created · {stats.joined} joined · {stats.waiting} waiting
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/profile"); }}>مشاهده پروفایل</MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate(stats.toReview > 0 ? "/my-projects?tab=review" : "/my-projects"); }}>
          پروژه‌های من{stats.toReview > 0 ? ` · ${stats.toReview} درخواست برای بررسی` : ""}
        </MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/my-projects?tab=requests"); }}>
          درخواست‌های ارسالی{stats.waiting > 0 ? ` · ${stats.waiting} در انتظار` : ""}
        </MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/notifications"); }}>اعلان‌ها</MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#071739",
          },
        }}
      >
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="بستن منو"
            sx={{ color: "white" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {sidebar}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#071739",
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Box
         component="main"
          sx={{
              flexGrow: 1,
              minWidth: 0,
              boxSizing: "border-box",
              position: "relative",
              pt: "96px",
              pb: 5,
              px: { xs: 2, sm: 3, md: 4, lg: 5 },

          }}
>
          {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
