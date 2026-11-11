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
        bgcolor: item.read ? "transparent" : "rgba(7,23,57,0.04)",
        "&:hover": { bgcolor: "#EEF2F7" },
        "&:focus-visible": { outline: "2px solid #071739", outlineOffset: -2 },
      }}
    >
      <Avatar sx={{ width: 34, height: 34, bgcolor: "#F0F3F8", color: meta.color }}>
        <Icon sx={{ fontSize: 18 }} />
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: item.read ? 500 : 700, fontSize: 14, wordBreak: "break-word" }}>{item.title}</Typography>
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
