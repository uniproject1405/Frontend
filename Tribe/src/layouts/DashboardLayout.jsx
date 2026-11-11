
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

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
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
    title: "My Projects",
    icon: <FolderRoundedIcon />,
    href: "/my-projects",
  },
  {
    title: "Create Project",
    icon: <AddCircleOutlineRoundedIcon />,
    href: "/create-project",
  },
  {
    title: "Notifications",
    icon: <NotificationsNoneRoundedIcon />,
    href: "/notifications",
    badge: true,
  },
  {
    title: "Profile",
    icon: <PersonRoundedIcon />,
    href: "/profile",
  },
];

const EMPTY = {};

function DashboardLayout({ children, pageTitle = "Dashboard" }) {
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

        <Typography
          variant="caption"
          sx={{ color: "#A4B5C4" }}
        >
          CREATE · CONNECT · GROW
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

      <Box
        sx={{
          mt: 6,
          mx: 1,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <DashboardRoundedIcon sx={{ color: "#E3C39D", mb: 1 }} />

        <Typography variant="subtitle2" sx={{ color: "#FFFFFF" }}>
          Your creative space
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "#A4B5C4", display: "block", mt: 1 }}
        >
          Build projects and collaborate with talented people.
        </Typography>
      </Box>
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
            aria-label="Open navigation"
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
              aria-label="Notifications"
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
              aria-label="Account menu"
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
                  {stats.toReview > 0 ? `${stats.toReview} to review` : profile.headline || "Account"}
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
          <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Box component="button" type="button" disabled={unread === 0} onClick={markAllRead} sx={{ all: "unset", cursor: "pointer", fontSize: 13, color: "#071739", textDecoration: "underline", "&[disabled]": { opacity: 0.4, cursor: "default" } }}>
            Mark all read
          </Box>
        </Box>
        <Divider />
        {notes.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>You're all caught up</Typography>
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
          View all {notes.length > 0 ? `(${notes.length})` : ""}
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
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/profile"); }}>View profile</MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/my-projects"); }}>
          My Projects{stats.toReview > 0 ? ` · ${stats.toReview} to review` : ""}
        </MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/my-projects?tab=requests"); }}>
          Sent requests{stats.waiting > 0 ? ` · ${stats.waiting} waiting` : ""}
        </MenuItem>
        <MenuItem onClick={() => { setUserAnchor(null); navigate("/notifications"); }}>Notifications</MenuItem>
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
            aria-label="Close navigation"
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
