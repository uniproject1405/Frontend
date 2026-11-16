import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Card, Stack, Tab, Tabs, Typography } from "@mui/material";

import { groupOf, markAllRead, markRead, useNotifications } from "../services/notificationService";
import { fa } from "../utils/fa";
import NotificationRow from "../components/NotificationRow";

const PAGE_SIZE = 10;

const filters = [
  ["all", "همه"],
  ["unread", "خوانده‌نشده"],
  ["requests", "درخواست‌ها"],
  ["updates", "به‌روزرسانی‌ها"],
];

function dayLabel(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "امروز";
  if (days < 2) return "دیروز";
  if (days < 7) return "این هفته";
  return "قبل‌تر";
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
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#071739" }}>اعلان‌ها</Typography>
          <Typography color="text.secondary">
            {unread === 0 ? "اعلان تازه‌ای ندارید" : `${fa(unread)} خوانده‌نشده`} · {fa(items.length)} اعلان
          </Typography>
        </Box>
        <Button variant="outlined" disabled={unread === 0} onClick={markAllRead}>خواندن همه</Button>
      </Stack>

      <Tabs value={filter} onChange={(_, v) => { setFilter(v); setVisible(PAGE_SIZE); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {filters.map(([value, label]) => <Tab key={value} value={value} label={label} />)}
      </Tabs>

      {filtered.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 600 }}>{filter === "unread" ? "اعلان خوانده‌نشده‌ای نیست" : "هنوز چیزی اینجا نیست"}</Typography>
          <Typography color="text.secondary">درخواست‌ها و پاسخ‌های تازه اینجا نمایش داده می‌شوند.</Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {groups.map((g) => (
            <Box key={g.label}>
              <Typography variant="overline" color="text.secondary">{g.label}</Typography>
              <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", "& > * + *": { borderTop: "1px solid #E4E9EF" } }}>
                {g.items.map((x) => <NotificationRow key={x.id} item={x} onOpen={open} />)}
              </Card>
            </Box>
          ))}
          {filtered.length > shown.length && (
            <Button onClick={() => setVisible((v) => v + PAGE_SIZE)} sx={{ alignSelf: "center" }}>
              نمایش بیشتر ({fa(filtered.length - shown.length)} مورد دیگر)
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default Notifications;
