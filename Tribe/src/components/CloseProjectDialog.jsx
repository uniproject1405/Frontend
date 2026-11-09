
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
        <Stack direction="row" alignItems="center" spacing={2}>
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
            Close Project?
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          Are you sure you want to close
          {project?.title ? ` "${project.title}"` : " this project"}?
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          This will change the project status to Closed.
        </Typography>
        
        {typeof onConfirm !== "function" && (
  <Alert severity="info" sx={{ mt: 2 }}>
    Closing projects will be available after
    the backend API is connected.
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
          Cancel
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
          {isClosing ? "Closing..." : "Close Project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloseProjectDialog;
