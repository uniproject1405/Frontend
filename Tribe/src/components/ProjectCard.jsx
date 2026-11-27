import { Link as RouterLink } from "react-router";
import { Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { CapacityMeter, SkillChips, StatusChip } from "./projectParts";
import { fa } from "../utils/fa";

const NAVY = "#071739";

// An owner's project: the Explore card look, plus the owner's actions.
// `accepted` and `pending` are counted by My Projects from the stored requests.
export default function ProjectCard({ project, onEdit, onClose, onRequests }) {
  const skills = Array.isArray(project.requiredSkills)
    ? project.requiredSkills.filter(Boolean)
    : String(project.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const isClosed = String(project.status ?? "").toLowerCase() === "closed";
  const capacity = Number(project.capacity) || 0;
  const accepted = Number(project.accepted) || 0;
  const pending = Number(project.pending) || 0;
  const summary = project.goal || project.description || "";

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%", minWidth: 0, height: "100%", display: "flex", flexDirection: "column",
        borderRadius: 3, transition: "box-shadow .2s", "&:hover": { boxShadow: "0 12px 30px rgba(7,23,57,.12)" },
      }}
    >
      <CardContent sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ mb: 1.5 }}>
          <StatusChip status={project.status} full={capacity > 0 && accepted >= capacity} />
        </Box>

        <Typography
          component={RouterLink}
          to={`/projects/${encodeURIComponent(project.id)}`}
          variant="h6"
          sx={{
            fontWeight: 700, color: NAVY, lineHeight: 1.5, mb: 1, textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere",
          }}
        >
          {project.title || "پروژه بدون عنوان"}
        </Typography>

        {summary && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.9, mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {summary}
          </Typography>
        )}

        <SkillChips skills={skills} max={3} />

        <Box sx={{ mt: "auto", pt: 2 }}>
          {capacity > 0 && <CapacityMeter accepted={accepted} capacity={capacity} sx={{ mb: 2 }} />}
          <Divider sx={{ mb: 1.5 }} />
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
        </Box>
      </CardContent>
    </Card>
  );
}
