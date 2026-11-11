
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
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
];

function DashboardLayout({ children, pageTitle = "Dashboard" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellAnchor, setBellAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const navigate = useNavigate();
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
                variant="dot"
                invisible
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    top: 4,
                    right: 4,
                    width: 7,
                    height: 7,
                    minWidth: 7,
                    border: "1.5px solid #F5F8FA",
                  },
                }}
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
                Be
              </Avatar>

              <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#071739", lineHeight: 1.2, fontSize: 11.5 }}
                >
                  Be Confidency
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", lineHeight: 1.2, fontSize: 9.5 }}
                >
                  Account
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
      >
        <MenuItem disabled sx={{ opacity: 1, color: "text.secondary" }}>
          You're all caught up
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={() => setUserAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setUserAnchor(null);
            navigate("/my-projects");
          }}
        >
          My Projects
        </MenuItem>
        <MenuItem
          onClick={() => {
            setUserAnchor(null);
            navigate("/my-projects?tab=requests");
          }}
        >
          Sent requests
        </MenuItem>
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
