import { Box, Button, Card, Typography } from "@mui/material";
import { formatDate } from "../../utils/requestStatus";
import { displayName } from "../../utils/displayName";
import StatusBadge from "./StatusBadge";

export default function RequestCard({ item, onOpen, onWithdraw }) {
  const { request, project, owner } = item;
  const createdAt = request.createdAt || request.created_at;
  const ownerLabel = displayName(owner);
  const category =
    project.category ||
    project.field ||
    project.domain ||
    (Array.isArray(project.requiredSkills) && project.requiredSkills[0]) ||
    "حوزه پروژه";
  const role = request.role || request.requestedRole || request.requested_role || null;

  return (
    <Card
      component="li"
      elevation={0}
      sx={{
        listStyle: "none",
        p: { xs: 2, sm: 2.2, md: 2.6 },
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.3, md: 1.6 },
        minHeight: { xs: 170, md: 200 },
        bgcolor: "#fff",
        border: "1px solid #D9E0E7",
        boxShadow: "0 2px 5px rgba(7,23,57,.035)",
        transition: "box-shadow .15s ease, transform .15s ease",
        "&:hover": { boxShadow: "0 5px 14px rgba(7,23,57,.07)", transform: "translateY(-1px)" },
      }}
    >
      {/* بالا: دسته (راست) + بج وضعیت (چپ) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
        <Typography sx={{ color: "#6C7D92", fontSize: { xs: 11.5, md: 12 }, textAlign: "start" }}>
          {category}
        </Typography>
        <StatusBadge status={request.status} />
      </Box>

      <Typography
        sx={{
          fontWeight: 800,
          fontSize: { xs: 16.5, md: 19 },
          color: "#071739",
          lineHeight: 1.5,
          textAlign: "start",
        }}
      >
        {project.title}
      </Typography>

      {/* صاحب پروژه (راست) + نقش درخواستی (چپ) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: 1.5,
          rowGap: 0.4,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ color: "#647991", fontSize: { xs: 11.5, md: 12 } }}>
          صاحب پروژه:{" "}
          <Box component="span" sx={{ color: "#263B58", fontWeight: 600 }}>
            {ownerLabel}
          </Box>
        </Typography>
        {role && (
          <Typography sx={{ color: "#647991", fontSize: { xs: 11.5, md: 12 } }}>
            نقش درخواستی:{" "}
            <Box component="span" sx={{ color: "#263B58", fontWeight: 600 }}>
              {role}
            </Box>
          </Typography>
        )}
      </Box>

      {/* پایین: تاریخ (راست) + دکمه‌ها (چپ) */}
      <Box
        sx={{
          mt: "auto",
          pt: 1.6,
          borderTop: "1px solid #E6EBF0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ color: "#718198", fontSize: { xs: 11, md: 11.5 } }}>
          ارسال: {formatDate(createdAt)}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.6, alignItems: "center" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onOpen(item)}
            sx={{
              borderColor: "#D5DDE5",
              color: "#263B58",
              borderRadius: "6px",
              px: 1.8,
              py: 0.55,
              minWidth: { xs: 96, md: 112 },
              fontSize: { xs: 11.5, md: 12 },
              "&:hover": { borderColor: "#071739", bgcolor: "#F8FAFC" },
            }}
          >
            مشاهده جزئیات
          </Button>
          {request.status === "pending" && (
            <Button
              size="small"
              color="error"
              variant="text"
              onClick={() => onWithdraw?.(item)}
              aria-label={`پس گرفتن درخواست پروژه ${project.title}`}
              sx={{ borderRadius: "6px", px: 1, py: 0.55, fontSize: { xs: 11.5, md: 12 }, fontWeight: 700 }}
            >
              پس گرفتن
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
}
