
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
  Snackbar,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";

import { Link, useLocation, useNavigate } from "react-router";
import {
  closeProject,
  getMyProjects,
} from "../services/mockProjectService";
import ProjectCard from "../components/ProjectCard";

function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [toast, setToast] = useState(location.state?.message || "");

  const loadProjects = useCallback(async () => {
    setStatus("loading");

    try {
      const data = await getMyProjects();
      setProjects(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (error) {
      console.error("Failed to load projects:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getMyProjects()
      .then((data) => {
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
        setStatus("success");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load projects:", error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleClose(project) {
    if (!project?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to close "${project.title}"?`
    );

    if (!confirmed) return;

    try {
      const updatedProject = await closeProject(project.id);

      setProjects((currentProjects) =>
        currentProjects.map((item) =>
          String(item.id) === String(updatedProject.id)
            ? updatedProject
            : item
        )
      );

      setToast("Project closed successfully.");
    } catch (error) {
      console.error("Failed to close project:", error);
      setToast(error.message || "Could not close the project.");
    }
  }

  function handleEdit(project) {
    if (project?.id == null) return;

    navigate(`/my-projects/${encodeURIComponent(project.id)}/edit`);
  }

  function handleRequests(project) {
    if (project?.id == null) return;

    navigate(`/my-projects/${encodeURIComponent(project.id)}/requests`);
  }

  const isLoading = status === "loading";
  const hasError = status === "error";
  const isConnected = status === "success";
  const isEmpty = isConnected && projects.length === 0;
  const hasProjects = isConnected && projects.length > 0;

  return (
    <Box
    sx={{
      width: {
        xs: "100%",
        lg: "calc(100% - 90px)",
      },
      maxWidth: "1180px",
      mx: { xs: "auto", lg: 0 },
      boxSizing: "border-box",
    }}
  >
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast("")}
          severity={
            toast.toLowerCase().includes("could not") ||
            toast.toLowerCase().includes("failed")
              ? "error"
              : "success"
          }
          variant="filled"
          sx={{ boxShadow: 3 }}
        >
          {toast}
        </Alert>
      </Snackbar>

      {/* Compact hero — PO review: shorter, no subtitle, 16px corners */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          color: "#FFFFFF",
          background: "linear-gradient(125deg, #071739 0%, #142A50 65%, #4B6382 150%)",
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 3.5 },
          mb: 4,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: "rgba(227,195,157,0.08)",
            top: -135,
            right: -65,
            pointerEvents: "none",
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Typography
            component="h1"
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "30px", sm: "36px" },
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            My Projects
          </Typography>

          <Button
            component={Link}
            to="/create-project"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              bgcolor: "#E3C39D",
              color: "#071739",
              borderRadius: "8px",
              flexShrink: 0,
              "&:hover": { bgcolor: "#D6B184" },
            }}
          >
            New Project
          </Button>
        </Stack>
      </Box>

      {/* SECTION HEADING */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Your Project Collection
          </Typography>

          <Typography variant="body2" color="text.secondary">
            All the projects you own, in one organized space.
          </Typography>
        </Box>

        {isConnected && (
          <Chip
            label={`${projects.length} Projects`}
            size="small"
            sx={{
              bgcolor: "#E8EEF3",
              color: "#4B6382",
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      {/* LOADING */}
      {isLoading && (
        <Card>
          <CardContent
            sx={{
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={36} />
            <Typography color="text.secondary">
              Loading your projects...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ERROR */}
      {hasError && (
        <Card>
          <CardContent
            sx={{
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
              p: 4,
            }}
          >
            <CloudOffRoundedIcon
              sx={{ fontSize: 44, color: "error.main" }}
            />

            <Typography variant="h6">
              Unable to load projects
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              Something went wrong while loading
              your projects. Please try again.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={loadProjects}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* EMPTY */}
      {isEmpty && (
        <Card>
          <CardContent
            sx={{
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              p: 4,
            }}
          >
            <FolderOpenRoundedIcon
              sx={{ fontSize: 48, color: "#4B6382", mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 1 }}>
              No projects yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 420, mb: 3 }}
            >
              You haven't created any projects yet.
              Create your first project to get started.
            </Typography>

            <Button
              component={Link}
              to="/create-project"
              variant="outlined"
              startIcon={<AddRoundedIcon />}
            >
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* PROJECTS */}
      {hasProjects && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onClose={handleClose}
              onRequests={handleRequests}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MyProjects;