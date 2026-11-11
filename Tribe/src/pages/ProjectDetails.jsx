import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router";
import {
  Alert, Snackbar, Avatar, Box, Button, Card, Chip, CircularProgress, Stack, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getProjectDetails } from "../services/membershipService";
import JoinRequestDialog from "../components/JoinRequestDialog";

const MEMBERS_SHOWN = 5;
const skillChipSx = { bgcolor: "#F0F3F8", color: "#4B6382", fontWeight: 500 };

function JoinArea({ details, onJoin }) {
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
  let hint = relation === "none" && !full ? "The owner will review your request" : "";
  if (relation === "member") { label = "You're on this team"; }
  else if (relation === "pending") { label = "Request sent"; hint = "Waiting for a reply"; }
  else if (closed) { label = "Project closed"; }
  else if (full) { label = "Project is full"; }
  const disabled = relation !== "none" || closed || full;

  if (closed && relation === "none") {
    return (
      <>
        <Typography sx={{ fontWeight: 600, mb: 1.5 }}>This project is closed</Typography>
        <Button fullWidth variant="outlined" component={RouterLink} to="/my-projects">Back to projects</Button>
      </>
    );
  }

  return (
    <>
      <Button fullWidth variant="contained" disabled={disabled} onClick={onJoin}>{label}</Button>
      {hint && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{hint}</Typography>
      )}
    </>
  );
}

function ProjectDetailsView({ projectId }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [sent, setSent] = useState(false);
  const [reload, setReload] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProjectDetails(projectId)
      .then((d) => !cancelled && setDetails(d))
      .catch((e) => !cancelled && setError(e.message || "Unable to load this project."));
    return () => { cancelled = true; };
  }, [projectId, reload]);

  const back = (
    <Button component={RouterLink} to="/my-projects" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
      Back
    </Button>
  );

  if (error) {
    return (
      <Box>
        {back}
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>We couldn't find this project</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>It may have been removed.</Typography>
          <Button variant="contained" component={RouterLink} to="/my-projects">Go to My Projects</Button>
        </Card>
      </Box>
    );
  }
  if (!details) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><CircularProgress /></Box>;
  }

  const { project, owner, members, spotsLeft } = details;
  const shown = showAll ? members : members.slice(0, MEMBERS_SHOWN);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Snackbar open={sent} autoHideDuration={3000} onClose={() => setSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" onClose={() => setSent(false)}>Request sent. Find replies in My Projects.</Alert>
      </Snackbar>
      {back}
      <Stack direction="row" sx={{ mb: 0.5, alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, wordBreak: "break-word" }}>
          {project.title}
        </Typography>
        {project.status !== "open" && <Chip label="Closed" variant="outlined" />}
      </Stack>
      {project.goal && <Typography color="text.secondary" sx={{ mb: 3 }}>{project.goal}</Typography>}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) 300px", xl: "minmax(0,1fr) 360px" }, alignItems: "start" }}>
        <Stack spacing={3} sx={{ order: { xs: 2, md: 1 }, minWidth: 0 }}>
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>About</Typography>
            <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word", mb: 2 }}>{project.description}</Typography>
            {project.requiredSkills?.length > 0 && (
              <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                {project.requiredSkills.map((sk) => <Chip key={sk} label={sk} sx={skillChipSx} />)}
              </Stack>
            )}
          </Card>
          {(project.commitment || project.lookingFor?.length > 0 || project.milestones?.length > 0) && (
            <Card sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={2.5}>
                {project.commitment && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>How the team works</Typography>
                    <Typography>{project.commitment}</Typography>
                  </Box>
                )}
                {project.lookingFor?.length > 0 && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>Who we're looking for</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {project.lookingFor.map((t) => <li key={t}><Typography>{t}</Typography></li>)}
                    </Box>
                  </Box>
                )}
                {project.milestones?.length > 0 && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>Roadmap</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {project.milestones.map((t) => <li key={t}><Typography>{t}</Typography></li>)}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Card>
          )}
        </Stack>

        <Box sx={{ display: { xs: "contents", md: "flex" }, flexDirection: "column", gap: 3, order: { md: 2 }, minWidth: 0, position: { md: "sticky" }, top: { md: 88 } }}>
          <Card sx={{ p: 3, order: { xs: 1, md: 0 } }}>
            {project.status === "open" && (
              <Typography variant="h5" component="p" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", mb: 2.5 }}>
                {spotsLeft === 0 ? "No spots left" : `${spotsLeft} of ${project.capacity} spots left`}
              </Typography>
            )}
            <JoinArea details={details} onJoin={() => setJoining(true)} />
            <JoinRequestDialog
              project={project}
              open={joining}
              onClose={() => setJoining(false)}
              onSent={() => { setJoining(false); setSent(true); setReload((n) => n + 1); }}
            />
          </Card>
        <Card sx={{ p: { xs: 2, sm: 3 }, order: { xs: 3, md: 0 } }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1.5 }}>Team</Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>{owner.name[0]}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="div">{owner.name} <Chip size="small" label="Owner" sx={{ bgcolor: "#E3C39D", color: "#071739", ml: 0.5 }} /></Typography>
                {owner.headline && <Typography variant="body2" color="text.secondary">{owner.headline}</Typography>}
              </Box>
            </Stack>
            {owner.bio && <Typography variant="body2" sx={{ color: "text.secondary", pl: 6.5, mt: -0.5 }}>{owner.bio}</Typography>}
            {shown.map((m) => (
              <Stack key={m.id} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#4B6382", width: 36, height: 36 }}>{m.name[0]}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography>{m.name}</Typography>
                  {m.headline && <Typography variant="body2" color="text.secondary">{m.headline}</Typography>}
                </Box>
              </Stack>
            ))}
            {members.length > MEMBERS_SHOWN && (
              <Button size="small" onClick={() => setShowAll((v) => !v)} sx={{ alignSelf: "flex-start" }}>
                {showAll ? "Show fewer" : `Show ${members.length - MEMBERS_SHOWN} more members`}
              </Button>
            )}
            {members.length === 0 && project.status === "open" && details.relation === "none" && (
              <Typography color="text.secondary">No members yet. Be the first to join.</Typography>
            )}
          </Stack>
        </Card>
        </Box>
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
