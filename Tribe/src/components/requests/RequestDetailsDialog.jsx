import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { formatDate, REQUEST_STATUS } from "../../utils/requestStatus";
import { displayName } from "../../utils/displayName";
import StatusBadge from "./StatusBadge";

export default function RequestDetailsDialog({ item, open, onClose, onWithdraw }) {
  if (!item) return null;

  const { request, project, owner } = item;
  const meta = REQUEST_STATUS[request.status] || REQUEST_STATUS.pending;
  const createdAt = request.createdAt || request.created_at;
  const category =
    project.category ||
    project.field ||
    project.domain ||
    (Array.isArray(project.requiredSkills) && project.requiredSkills[0]) ||
    null;
  const role =
    request.role ||
    request.requestedRole ||
    request.requested_role ||
    null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          جزئیات درخواست
        </Typography>
        <IconButton
          aria-label="بستن"
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* project title + category + status */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 20,
            lineHeight: 1.35,
            mb: 0.75,
          }}
        >
          {project.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          {category && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13.5 }}>
              {category}
            </Typography>
          )}
          <StatusBadge status={request.status} />
        </Box>

        {/* status message box */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#F4F7FA",
            border: "1px solid #E8EDF2",
            mb: 2.5,
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.85 }}>
            {meta.message}
          </Typography>
        </Box>

        {/* owner + role + date */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.4 }}
            >
              صاحب پروژه
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {displayName(owner)}
            </Typography>
          </Box>

          {role && (
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.4 }}
              >
                نقش درخواستی
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {role}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.4 }}
            >
              تاریخ ارسال
            </Typography>
            <Typography variant="body2">{formatDate(createdAt)}</Typography>
          </Box>
        </Box>

        {/* message */}
        {request.message ? (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.75 }}
            >
              معرفی ارسالی شما
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#FAFBFC",
                border: "1px solid #E8EDF2",
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {request.message}
              </Typography>
            </Box>
          </Box>
        ) : null}

        {/* about project */}
        {(project.goal || project.description) && (
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 0.75 }}
            >
              درباره پروژه
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.85, color: "text.secondary" }}>
              {project.goal || project.description}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {request.status === "pending" && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              onClose();
              onWithdraw?.(item);
            }}
          >
            پس گرفتن درخواست
          </Button>
        )}
        <Button variant="contained" onClick={onClose} sx={{ minWidth: 100 }}>
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}
