
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function CloseProjectDialog({
  open,
  project,
  onCancel,
  onConfirm,
  isClosing = false,
  error = "",
}) {
  function handleConfirm() {
    if (!project || typeof onConfirm !== "function") {
      return;
    }

    onConfirm(project);
  }

  return (
    <Dialog
      open={open}
      onClose={isClosing ? undefined : onCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="close-project-dialog-title"
    >
      <DialogTitle id="close-project-dialog-title">
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "#FFF0EE",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <LockOutlinedIcon sx={{ color: "#B42318" }} />
          </Box>

          <Typography variant="h6" component="span">
            بستن پروژه؟
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          مطمئن هستید که می‌خواهید {project?.title ? `«${project.title}»` : "این پروژه"} را ببندید؟
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          وضعیت پروژه به «بسته» تغییر می‌کند.
        </Typography>
        
        {typeof onConfirm !== "function" && (
  <Alert severity="info" sx={{ mt: 2 }}>
    بستن پروژه پس از اتصال به سرور فعال می‌شود.
  </Alert>
)}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onCancel}
          disabled={isClosing}
          variant="outlined"
        >
          انصراف
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={
            isClosing ||
            !project ||
            typeof onConfirm !== "function"
          }
          variant="contained"
          color="error"
          startIcon={
            isClosing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <LockOutlinedIcon />
            )
          }
        >
          {isClosing ? "در حال بستن..." : "بستن پروژه"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloseProjectDialog;
