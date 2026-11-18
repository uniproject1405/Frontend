import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";

const NAVY = "#0B1B3B";
const BLUE = "#4B6382";
const BORDER = "#E3E8EF";

const formatFaNumber = (value) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default function ProjectCard({ project, onEdit, onClose, onRequests }) {
  const skills = Array.isArray(project.requiredSkills)
    ? project.requiredSkills.filter(Boolean)
    : typeof project.requiredSkills === "string"
      ? project.requiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];
  const visibleSkills = skills.slice(0, 3);
  const remainingSkills = Math.max(skills.length - visibleSkills.length, 0);
  const isClosed = String(project.status ?? "").toLowerCase() === "closed";
  const category = String(project.category ?? "").trim();
  const displayCategory = !category || category.toUpperCase() === "MY PROJECT"
    ? "پروژه من"
    : category;

  const capacity = Number(project.capacity);
  const hasCapacity = project.capacity !== "" && project.capacity != null && Number.isFinite(capacity) && capacity > 0;
  // Accepted/available is not inferred from capacity alone; no fake member counts.
  const accepted = Number(project.accepted);
  const hasAccepted = project.accepted !== "" && project.accepted != null && Number.isFinite(accepted) && accepted >= 0;
  const available = hasCapacity && hasAccepted ? Math.max(capacity - accepted, 0) : null;
  const progressValue = hasCapacity && hasAccepted ? Math.min(100, Math.max(0, (accepted / capacity) * 100)) : 0;

  return (
    <Card
      dir="rtl"
      variant="outlined"
      sx={{
        width: "100%", minWidth: 0, height: "100%", alignSelf: "stretch",
        display: "flex", flexDirection: "column",
        borderRadius: "17px", bgcolor: "#FFFFFF", borderColor: BORDER,
        boxShadow: "0 2px 8px rgba(11,27,59,.025)",
        transition: "box-shadow .2s ease, transform .2s ease",
        "&:hover": { boxShadow: "0 12px 30px rgba(11,27,59,.10)", transform: "translateY(-2px)" },
      }}
    >
      <CardContent
        sx={{
          flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
          p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } },
        }}
      >
        {/* Top row: fixed separation and centered alignment. */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, minHeight: 38, mb: 2.4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0, flex: 1 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "#EEF2F6", color: NAVY, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <CodeOutlinedIcon sx={{ fontSize: 21 }} />
            </Box>
            <Typography sx={{ color: BLUE, fontWeight: 750, fontSize: 11, letterSpacing: ".5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayCategory}
            </Typography>
          </Box>
          <Chip
            size="small" label={isClosed ? "بسته‌شده" : "فعال"}
            sx={{
              flexShrink: 0, height: 27, borderRadius: "8px",
              bgcolor: isClosed ? "#F0F2F5" : "#F0E7DC",
              color: isClosed ? "#68798C" : NAVY,
              fontSize: 11, fontWeight: 700, m: 0,
              "& .MuiChip-label": { px: 1.3 },
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, mb: 2.2 }}>
          <Tooltip title={project.title || ""}>
            <Typography sx={{ color: NAVY, fontWeight: 750, fontSize: { xs: 17, sm: 19 }, lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere" }}>
              {project.title || "پروژه بدون عنوان"}
            </Typography>
          </Tooltip>
        </Box>

        {/* CSS gap, not Stack spacing, prevents touching / overlapping skill chips. */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", columnGap: "9px", rowGap: "9px", mb: 2.2, minHeight: 26 }}>
          {visibleSkills.map((skill, index) => (
            <Tooltip key={`${skill}-${index}`} title={skill}>
              <Chip label={skill} size="small" sx={{ height: 27, maxWidth: "100%", m: "0 !important",
                bgcolor: "#F0F3F8", color: BLUE, borderRadius: "7px", fontSize: 11,
                "& .MuiChip-label": { px: 1.3, overflow: "hidden", textOverflow: "ellipsis" } }} />
            </Tooltip>
          ))}
          {remainingSkills > 0 && (
            <Chip label={`+${remainingSkills}`} size="small" sx={{ height: 27, m: "0 !important", bgcolor: "#F0F3F8", color: BLUE, fontSize: 11 }} />
          )}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ mb: 1.8, borderColor: BORDER }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.1 }}>
            <Typography sx={{ fontSize: 11.5, color: BLUE }}>
              {hasCapacity
                ? hasAccepted ? `${formatFaNumber(accepted)} پذیرفته‌شده از ${formatFaNumber(capacity)} نفر` : `ظرفیت کل تیم: ${formatFaNumber(capacity)} نفر`
                : "ظرفیت تیم: —"}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: NAVY, fontWeight: 700 }}>
              {available == null ? "ظرفیت باقی‌مانده: —" : `${formatFaNumber(available)} نفر ظرفیت باقی‌مانده`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={progressValue}
            aria-label={hasAccepted ? "تعداد اعضای پذیرفته‌شده تیم" : "اطلاعات پیشرفت ظرفیت در دسترس نیست"}
            sx={{ height: 6, borderRadius: 3, bgcolor: "#EDF1F5", mb: 2.4,
              "& .MuiLinearProgress-bar": { bgcolor: "#9EB1C1", borderRadius: 3 } }}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 0.9 }}>
            <Button variant="outlined" size="small" onClick={() => onEdit?.(project)}
              disabled={typeof onEdit !== "function"} startIcon={<EditOutlinedIcon />}
              sx={{ minWidth: 0, minHeight: 38, px: 0.5, borderRadius: "9px", bgcolor: "#FFFFFF", color: NAVY,
                border: `1px solid ${NAVY}`, fontSize: 11, fontWeight: 700, textTransform: "none",
                boxShadow: "none", transition: "background-color .2s, color .2s",
                "&:hover": { bgcolor: NAVY, color: "#FFFFFF", borderColor: NAVY, boxShadow: "none" },
                "& .MuiButton-startIcon": { mr: 0.4, ml: 0, "& svg": { fontSize: 15 } } }}>
              ویرایش
            </Button>
            <Button variant="outlined" size="small" color="secondary" onClick={() => onRequests?.(project)}
              disabled={typeof onRequests !== "function"} startIcon={<PeopleOutlineRoundedIcon />}
              sx={{ minWidth: 0, minHeight: 38, px: 0.4, borderRadius: "9px", fontSize: 11, fontWeight: 700,
                textTransform: "none", boxShadow: "none",
                "& .MuiButton-startIcon": { mr: 0.2, ml: 0, "& svg": { fontSize: 15 } } }}>
              درخواست‌ها
            </Button>
            <Button variant="text" size="small" color="error" onClick={() => onClose?.(project)}
              disabled={typeof onClose !== "function" || isClosed} startIcon={<LockOutlinedIcon />}
              sx={{ minWidth: 0, minHeight: 38, px: 0.2, borderRadius: "9px", fontSize: 11, fontWeight: 700,
                textTransform: "none", "& .MuiButton-startIcon": { mr: 0.2, ml: 0, "& svg": { fontSize: 15 } } }}>
              بستن پروژه
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
