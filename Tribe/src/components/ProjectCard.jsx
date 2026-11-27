import { Link as RouterLink } from "react-router";
import { Box, Button, Card, CardActionArea, Divider, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { CapacityMeter, SkillChips, StatusChip } from "./projectParts";
import { fa } from "../utils/fa";

const NAVY = "#071739";

// An owner's project: the Explore card look, plus the owner's actions.
// `accepted` and `pending` are counted by My Projects from the stored requests.
// `dense` is the list view: one short row per project on wide screens.
export default function ProjectCard({ project, onEdit, onClose, onRequests, dense = false }) {
  const skills = Array.isArray(project.requiredSkills)
    ? project.requiredSkills.filter(Boolean)
    : String(project.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const isClosed = String(project.status ?? "").toLowerCase() === "closed";
  const capacity = Number(project.capacity) || 0;
  const accepted = Number(project.accepted) || 0;
  const pending = Number(project.pending) || 0;
  const summary = project.goal || project.description || "";
  const clamp = (lines) => ({ display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" });

  const actions = (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, "& .MuiButton-root": { flex: "1 1 auto", whiteSpace: "nowrap" } }}>
      <Button
        variant="outlined" size="small" onClick={() => onEdit?.(project)} startIcon={<EditOutlinedIcon />}
        sx={{ color: NAVY, borderColor: NAVY }}
      >
        ویرایش
      </Button>
      {/* The red count says how many people are waiting for an answer. */}
      <Button
        variant="outlined" size="small" color="secondary" onClick={() => onRequests?.(project)}
        startIcon={<PeopleOutlineRoundedIcon />}
        endIcon={pending ? (
          <Box component="span" sx={{ bgcolor: "error.main", color: "#fff", borderRadius: 5, px: 0.8, fontSize: 11, lineHeight: "18px" }}>
            {fa(pending)}
          </Box>
        ) : null}
      >
        درخواست‌ها
      </Button>
      {/* A closed project cannot be closed again, so the action disappears. */}
      {!isClosed && (
        <Button variant="text" size="small" color="error" onClick={() => onClose?.(project)} startIcon={<LockOutlinedIcon />}>
          بستن پروژه
        </Button>
      )}
    </Box>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%", minWidth: 0, height: "100%", display: "flex", flexDirection: "column",
        borderRadius: 3, transition: "box-shadow .2s", "&:hover": { boxShadow: "0 12px 30px rgba(7,23,57,.12)" },
        // List rows sit side by side on wide screens: details | capacity | actions.
        ...(dense && { flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" } }),
      }}
    >
      {/* Everything above the buttons opens the project, like an Explore card. */}
      <CardActionArea
        component={RouterLink}
        to={`/projects/${encodeURIComponent(project.id)}`}
        sx={{
          flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start",
          p: dense ? 2 : 2.5, pb: dense ? 2 : 0,
          ...(dense && { flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "stretch", md: "center" }, gap: { md: 3 } }),
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ mb: dense ? 1 : 1.5 }}>
            <StatusChip status={project.status} full={capacity > 0 && accepted >= capacity} />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: NAVY, lineHeight: 1.5, mb: dense ? 0.5 : 1, fontSize: dense ? 17 : undefined, overflowWrap: "anywhere", ...clamp(dense ? 1 : 2) }}
          >
            {project.title || "پروژه بدون عنوان"}
          </Typography>
          {summary && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9, mb: dense ? 0 : 2, ...clamp(dense ? 1 : 2) }}>
              {summary}
            </Typography>
          )}
          {!dense && <SkillChips skills={skills} max={3} />}
        </Box>
        {capacity > 0 && (
          <CapacityMeter
            accepted={accepted}
            capacity={capacity}
            sx={dense ? { width: { xs: "100%", md: 220 }, flexShrink: 0, mt: { xs: 1.5, md: 0 } } : { mt: "auto", pt: 2, mb: 2 }}
          />
        )}
      </CardActionArea>

      <Box sx={dense ? { p: 2, pt: { xs: 0, md: 2 }, flexShrink: 0, width: { md: 330 } } : { px: 2.5, pb: 2.5 }}>
        {!dense && <Divider sx={{ mb: 1.5 }} />}
        {actions}
      </Box>
    </Card>
  );
}
