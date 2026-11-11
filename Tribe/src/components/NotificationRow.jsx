import { Avatar, Box, Typography } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import { timeAgo } from "../services/notificationService";

const typeMeta = {
  request_received: { icon: PersonAddAltRoundedIcon, color: "#071739" },
  request_accepted: { icon: CheckCircleRoundedIcon, color: "#1E7B4A" },
  request_rejected: { icon: CancelRoundedIcon, color: "#B42318" },
  member_joined: { icon: GroupsRoundedIcon, color: "#4B6382" },
  project_full: { icon: GroupsRoundedIcon, color: "#A68868" },
  project_closed: { icon: LockRoundedIcon, color: "#4B6382" },
  request_sent: { icon: SendRoundedIcon, color: "#4B6382" },
};
const fallbackMeta = { icon: NotificationsNoneRoundedIcon, color: "#4B6382" };

function NotificationRow({ item, onOpen, dense = false }) {
  const meta = typeMeta[item.type] || fallbackMeta;
  const Icon = meta.icon;
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen(item)}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        width: "100%",
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
        p: dense ? 1.25 : 2,
        cursor: "pointer",
        bgcolor: item.read ? "#E9EDF2" : "#FFFFFF",
        borderLeft: item.read ? "3px solid transparent" : "3px solid #071739",
        opacity: 1,
        transition: "background-color .15s",
        "&:hover": { bgcolor: item.read ? "#DFE5EC" : "#F3F6FA" },
        "&:focus-visible": { outline: "2px solid #071739", outlineOffset: -2 },
      }}
    >
      <Avatar sx={{ width: 34, height: 34, bgcolor: item.read ? "#D5DCE5" : "#F0F3F8", color: item.read ? "#7A8798" : meta.color }}>
        <Icon sx={{ fontSize: 18 }} />
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: item.read ? 400 : 700, fontSize: 14, wordBreak: "break-word", color: item.read ? "#5F6F84" : "#071739" }}>{item.title}</Typography>
        {item.body && (
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.body}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">{timeAgo(item.createdAt)}</Typography>
      </Box>
      {!item.read && <Box aria-label="Unread" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#B42318", mt: 1, flexShrink: 0 }} />}
    </Box>
  );
}


export default NotificationRow;
