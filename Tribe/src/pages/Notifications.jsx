import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";

import { groupOf, markAllRead, markRead, useNotifications } from "../services/notificationService";
import NotificationRow from "../components/NotificationRow";

const PAGE_SIZE = 10;

const filters = [
  ["all", "All"],
  ["unread", "Unread"],
  ["requests", "Requests"],
  ["updates", "Updates"],
];

function dayLabel(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return "This week";
  return "Earlier";
}

function Notifications() {
  const navigate = useNavigate();
  const { items, unread } = useNotifications();
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = items.filter((x) => {
    if (filter === "unread") return !x.read;
    if (filter === "all") return true;
    return groupOf(x.type) === filter;
  });
  const shown = filtered.slice(0, visible);

  function open(item) {
    markRead(item.id);
    navigate(item.link || "/my-projects");
  }

  const groups = [];
  shown.forEach((x) => {
    const label = dayLabel(x.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(x);
    else groups.push({ label, items: [x] });
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", width: "100%" }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Notifications</Typography>
          <Typography color="text.secondary">
            {unread === 0 ? "You're all caught up" : `${unread} unread`} · {items.length} total
          </Typography>
        </Box>
        <Button variant="outlined" disabled={unread === 0} onClick={markAllRead}>Mark all as read</Button>
      </Stack>

      <Tabs value={filter} onChange={(_, v) => { setFilter(v); setVisible(PAGE_SIZE); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {filters.map(([value, label]) => <Tab key={value} value={value} label={label} />)}
      </Tabs>

      {filtered.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 600 }}>{filter === "unread" ? "Nothing unread" : "Nothing here yet"}</Typography>
          <Typography color="text.secondary">New requests and replies will show up here.</Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {groups.map((g) => (
            <Box key={g.label}>
              <Typography variant="overline" color="text.secondary">{g.label}</Typography>
              <Card sx={{ overflow: "hidden", "& > * + *": { borderTop: "1px solid #E4E9EF" } }}>
                {g.items.map((x) => <NotificationRow key={x.id} item={x} onOpen={open} />)}
              </Card>
            </Box>
          ))}
          {filtered.length > shown.length && (
            <Button onClick={() => setVisible((v) => v + PAGE_SIZE)} sx={{ alignSelf: "center" }}>
              Show more ({filtered.length - shown.length} left)
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default Notifications;
