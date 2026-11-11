import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Stack, Typography,
} from "@mui/material";

import { getJoinedProjects, getMyRequests, useMyStats, withdrawRequest } from "../services/membershipService";

const statusLabel = { pending: "Waiting", accepted: "Accepted", rejected: "Not accepted" };
const statusColor = { pending: "default", accepted: "success", rejected: "default" };

function Row({ to, title, meta, action, children }) {
  return (
    <Card sx={{ position: "relative", p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", transition: "transform .15s", "&:hover": { transform: "translateY(-2px)" } }}>
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
    <Card sx={{ p: 4, textAlign: "center" }}>
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
      .catch((e) => !cancelled && setError(e.message || "Unable to load."));
    return () => { cancelled = true; };
  }, [tab, reload]);

  async function confirmWithdraw() {
    const id = toWithdraw.request.id;
    setToWithdraw(null);
    try {
      await withdrawRequest(id);
      onToast("Request withdrawn");
      setReload((n) => n + 1);
    } catch (e) {
      onToast(e.message || "Could not withdraw the request.");
    }
  }

  if (tab === "review") {
    if (stats.byProject.length === 0) return <Empty text="No one is waiting on you. New requests to your projects will show up here." />;
    return (
      <Stack spacing={1.5}>
        {stats.byProject.map(({ project, count }) => (
          <Row
            key={project.id}
            to={`/my-projects/${project.id}/requests`}
            title={project.title}
            meta={`${count} ${count === 1 ? "person wants" : "people want"} to join`}
            action={<Button variant="contained" sx={{ position: "relative", zIndex: 1 }} component={RouterLink} to={`/my-projects/${project.id}/requests`}>Review {count}</Button>}
          />
        ))}
      </Stack>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!items) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  if (tab === "joined") {
    if (items.length === 0) return <Empty text="Teams you join will show up here." />;
    return (
      <Stack spacing={1.5}>
        {items.map(({ project, owner, memberCount, joinedAt }) => {
          const left = Math.max(project.capacity - memberCount, 0);
          return (
            <Row
              key={project.id}
              to={`/projects/${project.id}`}
              title={project.title}
              meta={`Owner: ${owner.name}${owner.headline ? ` · ${owner.headline}` : ""}`}
              action={project.status !== "open" ? <Chip size="small" variant="outlined" label="Closed" /> : null}
            >
              {project.goal && (
                <Typography variant="body2" sx={{ mt: 0.75, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.goal}</Typography>
              )}
              <Stack direction="row" sx={{ mt: 1, gap: 0.75, flexWrap: "wrap" }}>
                {(project.requiredSkills || []).slice(0, 4).map((sk) => <Chip key={sk} size="small" label={sk} sx={{ bgcolor: "#F0F3F8", color: "#4B6382" }} />)}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                {memberCount} {memberCount === 1 ? "member" : "members"} · {left === 0 ? "team full" : `${left} ${left === 1 ? "spot" : "spots"} left`} · joined {new Date(joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </Typography>
            </Row>
          );
        })}
      </Stack>
    );
  }

  if (items.length === 0) return <Empty text="Requests you send will show up here." />;
  return (
    <>
      <Stack spacing={1.5}>
        {items.map((x) => (
          <Row
            key={x.request.id}
            to={`/projects/${x.project.id}`}
            title={x.project.title}
            meta={<Chip size="small" variant="outlined" label={statusLabel[x.request.status]} color={statusColor[x.request.status]} />}
            action={x.request.status === "pending" && <Button color="inherit" sx={{ position: "relative", zIndex: 1, color: "text.secondary" }} onClick={() => setToWithdraw(x)}>Withdraw</Button>}
          />
        ))}
      </Stack>
      <Dialog open={Boolean(toWithdraw)} onClose={() => setToWithdraw(null)}>
        <DialogTitle>Withdraw request?</DialogTitle>
        <DialogContent>
          <DialogContentText>The owner will no longer see your request to join {toWithdraw?.project.title}.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToWithdraw(null)}>Keep request</Button>
          <Button color="error" onClick={confirmWithdraw}>Yes, withdraw</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MembershipTabs;
