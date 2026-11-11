import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router";
import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, LinearProgress, Stack, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getProjectDetails } from "../services/membershipService";

const skillChipSx = { bgcolor: "#F0F3F8", color: "#4B6382", fontWeight: 500 };

function JoinArea({ details }) {
  const { project, relation, spotsLeft } = details;
  const closed = project.status !== "open";
  const full = spotsLeft === 0;

  if (relation === "owner") {
    return (
      <Button fullWidth variant="contained" component={RouterLink} to={`/my-projects/${project.id}/requests`}>
        Manage project
      </Button>
    );
  }
  let label = "Request to join";
  let hint = "";
  if (relation === "member") { label = "You're on this team"; }
  else if (relation === "pending") { label = "Request sent"; hint = "Waiting for a reply"; }
  else if (closed) { label = "Project closed"; }
  else if (full) { label = "Project is full"; }
  const disabled = relation !== "none" || closed || full;

  return (
    <>
      <Button fullWidth variant="contained" disabled={disabled}>{label}</Button>
      {hint && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{hint}</Typography>
      )}
    </>
  );
}

function ProjectDetailsView({ projectId }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProjectDetails(projectId)
      .then((d) => !cancelled && setDetails(d))
      .catch((e) => !cancelled && setError(e.message || "Unable to load this project."));
    return () => { cancelled = true; };
  }, [projectId]);

  const back = (
    <Button component={RouterLink} to="/my-projects" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
      Back
    </Button>
  );

  if (error) {
    return (
      <Box>{back}<Alert severity="error">{error}</Alert></Box>
    );
  }
  if (!details) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><CircularProgress /></Box>;
  }

  const { project, owner, members, spotsLeft } = details;
  const taken = project.capacity - spotsLeft;

  return (
    <Box sx={{ maxWidth: 1000 }}>
      {back}
      <Stack direction="row" spacing={2} sx={{ mb: 0.5, alignItems: "center" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, wordBreak: "break-word" }}>
          {project.title}
        </Typography>
        <Chip label={project.status === "open" ? "Open" : "Closed"} color={project.status === "open" ? "success" : "default"} variant="outlined" />
      </Stack>
      {project.goal && <Typography color="text.secondary" sx={{ mb: 3 }}>{project.goal}</Typography>}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 320px" }, alignItems: "start" }}>
        <Stack spacing={3} sx={{ order: { xs: 2, md: 1 } }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>About</Typography>
            <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{project.description}</Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1.5 }}>Skills needed</Typography>
            <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
              {project.requiredSkills?.map((s) => <Chip key={s} label={s} sx={skillChipSx} />)}
            </Stack>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1.5 }}>Team</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>{owner.name[0]}</Avatar>
                <Typography>{owner.name}</Typography>
                <Chip size="small" label="Owner" sx={{ bgcolor: "#E3C39D", color: "#071739" }} />
              </Stack>
              {members.map((m) => (
                <Stack key={m.id} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#4B6382", width: 36, height: 36 }}>{m.name[0]}</Avatar>
                  <Typography>{m.name}</Typography>
                </Stack>
              ))}
              {members.length === 0 && (
                <Typography color="text.secondary">No members yet. Be the first to join.</Typography>
              )}
            </Stack>
          </Card>
        </Stack>

        <Card sx={{ p: 3, position: { md: "sticky" }, top: { md: 24 }, order: { xs: 1, md: 2 } }}>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {spotsLeft} of {project.capacity} spots left
          </Typography>
          <LinearProgress
            variant="determinate"
            value={project.capacity ? (taken / project.capacity) * 100 : 0}
            sx={{ my: 1.5, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Owner: {owner.name}</Typography>
          <JoinArea details={details} />
        </Card>
      </Box>
    </Box>
  );
}

// key resets loading/error state when the id changes
function ProjectDetails() {
  const { projectId } = useParams();
  return <ProjectDetailsView key={projectId} projectId={projectId} />;
}

export default ProjectDetails;
