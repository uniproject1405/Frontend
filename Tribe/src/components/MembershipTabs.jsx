import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Stack, Typography,
} from "@mui/material";

import ExploreProjectCard from "./ExploreProjectCard";
import { fa } from "../utils/fa";
import { getJoinedProjects, getMyRequests, useMyStats, withdrawRequest } from "../services/membershipService";

const statusLabel = { pending: "در انتظار", accepted: "پذیرفته شد", rejected: "پذیرفته نشد" };
const statusColor = { pending: "default", accepted: "success", rejected: "default" };

function Row({ to, title, meta, action, children }) {
  return (
    <Card variant="outlined" sx={{ position: "relative", p: 2.5, borderRadius: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", transition: "transform .15s", "&:hover": { transform: "translateY(-2px)" } }}>
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography component={RouterLink} to={to} sx={{ fontWeight: 600, color: "text.primary", textDecoration: "none", "&:hover": { textDecoration: "underline" }, "&::after": { content: '""', position: "absolute", inset: 0 } }}>
          {title}
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">{meta}</Typography>
        {children}
      </Box>
      {action}
    </Card>
  );
}

function Empty({ text }) {
  return (
    <Card variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
      <Typography color="text.secondary">{text}</Typography>
    </Card>
  );
}

// Loads on mount; parent remounts via key when the tab changes.
function MembershipTabs({ tab, onToast }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [toWithdraw, setToWithdraw] = useState(null);
  const [reload, setReload] = useState(0);
  const stats = useMyStats();

  useEffect(() => {
    if (tab === "review") return undefined;
    let cancelled = false;
    (tab === "joined" ? getJoinedProjects() : getMyRequests())
      .then((d) => !cancelled && setItems(d))
      .catch((e) => !cancelled && setError(e.message || "بارگذاری ممکن نشد."));
    return () => { cancelled = true; };
  }, [tab, reload]);

  async function confirmWithdraw() {
    const id = toWithdraw.request.id;
    setToWithdraw(null);
    try {
      await withdrawRequest(id);
      onToast("درخواست پس گرفته شد");
      setReload((n) => n + 1);
    } catch (e) {
      onToast(e.message || "پس گرفتن درخواست انجام نشد.");
    }
  }

  if (tab === "review") {
    if (stats.byProject.length === 0) return <Empty text="کسی منتظر شما نیست. درخواست‌های تازه برای پروژه‌هایتان اینجا نمایش داده می‌شوند." />;
    return (
      <Stack spacing={1.5}>
        {stats.byProject.map(({ project, count }) => (
          <Row
            key={project.id}
            to={`/my-projects/${project.id}/requests`}
            title={project.title}
            meta={`${fa(count)} نفر ${count === 1 ? "می‌خواهد عضو شود" : "می‌خواهند عضو شوند"}`}
            action={<Button variant="contained" sx={{ position: "relative", zIndex: 1 }} component={RouterLink} to={`/my-projects/${project.id}/requests`}>بررسی {fa(count)}</Button>}
          />
        ))}
      </Stack>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!items) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  if (tab === "joined") {
    if (items.length === 0) return <Empty text="تیم‌هایی که عضو می‌شوید اینجا نمایش داده می‌شوند." />;
    // Same card as Explore: a joined team looks the same everywhere, and opens its project page.
    return (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {items.map(({ project, owner, memberCount }) => (
          <ExploreProjectCard
            key={project.id}
            project={{ ...project, accepted: memberCount, creator: { name: owner.name, username: owner.username, role: owner.headline } }}
          />
        ))}
      </Box>
    );
  }

  if (items.length === 0) return <Empty text="درخواست‌هایی که می‌فرستید اینجا نمایش داده می‌شوند." />;
  return (
    <>
      <Stack spacing={1.5}>
        {items.map((x) => (
          <Row
            key={x.request.id}
            to={`/projects/${x.project.id}`}
            title={x.project.title}
            meta={<Chip size="small" variant="outlined" label={statusLabel[x.request.status]} color={statusColor[x.request.status]} />}
            action={x.request.status === "pending" && <Button color="inherit" sx={{ position: "relative", zIndex: 1, color: "text.secondary" }} onClick={() => setToWithdraw(x)}>پس گرفتن</Button>}
          />
        ))}
      </Stack>
      <Dialog open={Boolean(toWithdraw)} onClose={() => setToWithdraw(null)}>
        <DialogTitle>درخواست پس گرفته شود؟</DialogTitle>
        <DialogContent>
          <DialogContentText>مالک پروژه دیگر درخواست شما برای پیوستن به {toWithdraw?.project.title} را نخواهد دید.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToWithdraw(null)}>نگه داشتن</Button>
          <Button color="error" onClick={confirmWithdraw}>بله، پس می‌گیرم</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MembershipTabs;
