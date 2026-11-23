import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router";
import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Snackbar, Stack, Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import { LOGIN_PATH } from "../services/currentUser";
import { useAuth } from "../features/auth/useAuth.js";
import { getProjectDetails } from "../services/membershipService";
import JoinRequestDialog from "../components/JoinRequestDialog";
import { CapacityMeter, CreatorRow, SkillChips, StatusChip } from "../components/projectParts";
import { fa } from "../utils/fa";

const NAVY = "#071739";
const MEMBERS_SHOWN = 5;
const panel = { borderRadius: 3, p: { xs: 2.5, sm: 3 } };

function JoinArea({ details, relation, signedIn, onJoin }) {
  const { project, owner, spotsLeft } = details;
  const closed = project.status !== "open";
  const full = spotsLeft === 0;

  if (relation === "owner") {
    return (
      <Button fullWidth variant="contained" component={RouterLink} to={`/my-projects/${project.id}/requests`}>
        مدیریت پروژه
      </Button>
    );
  }
  if (closed && relation === "none") {
    return (
      <>
        <Typography sx={{ fontWeight: 600, mb: 1.5 }}>این پروژه بسته شده است</Typography>
        <Button fullWidth variant="outlined" component={RouterLink} to="/explore">بازگشت به کاوش پروژه‌ها</Button>
      </>
    );
  }

  let label = "درخواست عضویت";
  let hint = "";
  if (relation === "member") label = "شما عضو این تیم هستید";
  else if (relation === "pending") { label = "درخواست ارسال شد"; hint = "در انتظار پاسخ مالک پروژه"; }
  else if (closed) label = "پروژه بسته شده";
  else if (full) label = "ظرفیت تکمیل است";
  else if (!signedIn) hint = "برای ارسال درخواست باید وارد شوید.";
  const disabled = relation !== "none" || closed || full;

  const chatOwnerId = owner?.id || project.creator?.id || 101;
  const chatOwnerName = owner?.name || project.creator?.display_name || "مالک پروژه";

  return (
    <>
      <Button fullWidth variant="contained" disabled={disabled} onClick={onJoin}>{label}</Button>
      {relation !== "owner" && (
        <Button
          fullWidth
          variant="outlined"
          component={RouterLink}
          to={`/chat?user=${encodeURIComponent(chatOwnerId)}&userName=${encodeURIComponent(chatOwnerName)}&project=${encodeURIComponent(project.id)}&projectTitle=${encodeURIComponent(project.title)}`}
          sx={{
            mt: 1.5,
            borderColor: "#CDD5DB",
            color: NAVY,
            fontWeight: 600,
            "&:hover": { borderColor: NAVY, bgcolor: "rgba(7, 23, 57, 0.04)" },
          }}
          startIcon={<ForumOutlinedIcon />}
        >
          گفت‌وگو و مذاکره با {chatOwnerName}
        </Button>
      )}
      {hint && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>{hint}</Typography>
      )}
    </>
  );
}

function Member({ name, headline, owner }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: owner ? "#E3C39D" : "#CDD5DB", color: NAVY }}>{name[0]}</Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="div" sx={{ fontSize: 14, fontWeight: 600 }}>
          {name}
          {owner && <Chip size="small" label="مالک" sx={{ bgcolor: "#E3C39D", color: NAVY, ml: 1, height: 20 }} />}
        </Typography>
        {headline && <Typography variant="caption" color="text.secondary">{headline}</Typography>}
      </Box>
    </Stack>
  );
}

function ProjectDetailsView({ projectId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      .catch((e) => !cancelled && setError(e.message || "بارگذاری این پروژه ممکن نشد."));
    return () => { cancelled = true; };
  }, [projectId, reload]);

  // Back goes to wherever you came from (Explore, Home, My projects); opened directly → Explore.
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/explore"));
  const back = (
    <Button onClick={goBack} startIcon={<ArrowForwardIcon />} sx={{ mb: 2, color: NAVY }}>
      بازگشت
    </Button>
  );

  if (error) {
    return (
      <Box>
        {back}
        <Card variant="outlined" sx={{ ...panel, textAlign: "center" }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>این پروژه پیدا نشد</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>ممکن است حذف شده باشد.</Typography>
          <Button variant="contained" component={RouterLink} to="/explore">کاوش پروژه‌ها</Button>
        </Card>
      </Box>
    );
  }
  if (!details) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><CircularProgress /></Box>;
  }

  const { project, owner, members, spotsLeft } = details;
  // A signed-out visitor is just a visitor, whatever the mock user owns.
  const relation = isAuthenticated ? details.relation : "none";
  const shown = showAll ? members : members.slice(0, MEMBERS_SHOWN);
  const onJoin = () =>
    isAuthenticated ? setJoining(true) : navigate(`${LOGIN_PATH}?next=${encodeURIComponent(location.pathname)}`);

  return (
    <Box>
      <Snackbar open={sent} autoHideDuration={6000} onClose={() => setSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSent(false)}
          action={
            <Button color="inherit" size="small" component={RouterLink} to="/my-projects?tab=requests">
              درخواست‌های من
            </Button>
          }
        >
          درخواست ارسال شد.
        </Alert>
      </Snackbar>

      {back}

      <Card variant="outlined" sx={{ ...panel, mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <CreatorRow creator={{ name: owner.name, role: "ایجادکننده‌ی پروژه" }} />
          <StatusChip status={project.status} />
        </Stack>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: NAVY, wordBreak: "break-word", lineHeight: 1.5 }}>
          {project.title}
        </Typography>
        {project.goal && <Typography color="text.secondary" sx={{ mt: 1 }}>{project.goal}</Typography>}
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) 340px" }, alignItems: "start" }}>
        <Stack spacing={3} sx={{ order: { xs: 2, md: 1 }, minWidth: 0 }}>
          <Card variant="outlined" sx={panel}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>درباره پروژه</Typography>
            <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word", lineHeight: 1.9, mb: 2 }}>{project.description}</Typography>
            <SkillChips skills={project.requiredSkills} />
          </Card>
          {(project.commitment || project.lookingFor?.length > 0 || project.milestones?.length > 0) && (
            <Card variant="outlined" sx={panel}>
              <Stack spacing={2.5}>
                {project.commitment && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>شیوه کار تیم</Typography>
                    <Typography>{project.commitment}</Typography>
                  </Box>
                )}
                {project.lookingFor?.length > 0 && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>به دنبال چه کسی هستیم</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {project.lookingFor.map((t) => <li key={t}><Typography>{t}</Typography></li>)}
                    </Box>
                  </Box>
                )}
                {project.milestones?.length > 0 && (
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>نقشه راه</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                      {project.milestones.map((t) => <li key={t}><Typography>{t}</Typography></li>)}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Card>
          )}
        </Stack>

        <Box sx={{ display: { xs: "contents", md: "flex" }, flexDirection: "column", gap: 3, order: { md: 2 }, minWidth: 0, position: { md: "sticky" }, top: { md: 24 } }}>
          <Card variant="outlined" sx={{ ...panel, order: { xs: 1, md: 0 } }}>
            <CapacityMeter accepted={members.length} capacity={project.capacity} sx={{ mb: 2.5 }} />
            {project.status === "open" && (
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                {spotsLeft === 0 ? "جای خالی نیست" : `${fa(spotsLeft)} جای خالی برای عضو جدید`}
              </Typography>
            )}
            <JoinArea details={details} relation={relation} signedIn={isAuthenticated} onJoin={onJoin} />
            <JoinRequestDialog
              project={project}
              open={joining}
              onClose={() => setJoining(false)}
              onSent={() => { setJoining(false); setSent(true); setReload((n) => n + 1); }}
            />
          </Card>

          <Card variant="outlined" sx={{ ...panel, order: { xs: 3, md: 0 } }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>تیم</Typography>
            <Stack spacing={1.5}>
              <Member name={owner.name} headline={owner.headline} owner />
              {owner.bio && <Typography variant="body2" sx={{ color: "text.secondary", pl: 6.5, mt: -0.5 }}>{owner.bio}</Typography>}
              {shown.map((m) => <Member key={m.id} name={m.name} headline={m.headline} />)}
              {members.length > MEMBERS_SHOWN && (
                <Button size="small" onClick={() => setShowAll((v) => !v)} sx={{ alignSelf: "flex-start" }}>
                  {showAll ? "نمایش کمتر" : `نمایش ${fa(members.length - MEMBERS_SHOWN)} عضو دیگر`}
                </Button>
              )}
              {members.length === 0 && project.status === "open" && relation === "none" && (
                <Typography color="text.secondary">هنوز عضوی نیست. اولین نفر باشید.</Typography>
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
