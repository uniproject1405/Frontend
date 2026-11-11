import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Alert, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Stack, Typography,
} from "@mui/material";

import { getJoinedProjects, getMyRequests, withdrawRequest } from "../services/membershipService";

const statusLabel = { pending: "Waiting", accepted: "Accepted", rejected: "Not accepted" };
const statusColor = { pending: "default", accepted: "success", rejected: "error" };

function Row({ to, title, meta, action }) {
  return (
    <Card sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography component={RouterLink} to={to} sx={{ fontWeight: 600, color: "text.primary", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">{meta}</Typography>
      </Box>
      {action}
    </Card>
  );
}

function Empty({ text, cta }) {
  return (
    <Card sx={{ p: 4, textAlign: "center" }}>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{text}</Typography>
      <Button variant="outlined" component={RouterLink} to="/my-projects">{cta}</Button>
    </Card>
  );
}

// Loads on mount; parent remounts via key when the tab changes.
function MembershipTabs({ tab, onToast }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [toWithdraw, setToWithdraw] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
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

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!items) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  if (tab === "joined") {
    if (items.length === 0) return <Empty text="You haven't joined a team yet." cta="Find a project" />;
    return (
      <Stack spacing={1.5}>
        {items.map(({ project, owner }) => (
          <Row key={project.id} to={`/projects/${project.id}`} title={project.title} meta={`Owner: ${owner.name}`} />
        ))}
      </Stack>
    );
  }

  if (items.length === 0) return <Empty text="You haven't asked to join anything yet." cta="Find a project" />;
  return (
    <>
      <Stack spacing={1.5}>
        {items.map((x) => (
          <Row
            key={x.request.id}
            to={`/projects/${x.project.id}`}
            title={x.project.title}
            meta={<Chip size="small" variant="outlined" label={statusLabel[x.request.status]} color={statusColor[x.request.status]} />}
            action={x.request.status === "pending" && <Button onClick={() => setToWithdraw(x)}>Withdraw</Button>}
          />
        ))}
      </Stack>
      <Dialog open={Boolean(toWithdraw)} onClose={() => setToWithdraw(null)}>
        <DialogTitle>Withdraw request?</DialogTitle>
        <DialogContent>
          <DialogContentText>The owner will no longer see your request to join {toWithdraw?.project.title}.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToWithdraw(null)}>Keep it</Button>
          <Button color="error" onClick={confirmWithdraw}>Withdraw</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MembershipTabs;
