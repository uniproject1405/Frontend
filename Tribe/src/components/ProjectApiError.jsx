
import { Alert, AlertTitle, Box } from "@mui/material";

function ProjectApiError({ error }) {
  if (!error) {
    return null;
  }

  const message =
    typeof error === "string"
      ? error
      : error.message || "Something went wrong. Please try again.";

  return (
    <Box role="alert" sx={{ width: "100%" }}>
      <Alert
        severity="error"
        variant="outlined"
        sx={{
          borderRadius: 3,
          bgcolor: "#FFF8F7",
          borderColor: "#F3C5C0",
          py: 1,
          "& .MuiAlert-icon": {
            color: "#B42318",
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700 }}>
          Unable to complete request
        </AlertTitle>

        {message}
      </Alert>
    </Box>
  );
}

export default ProjectApiError;
