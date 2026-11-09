import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { Link, useParams } from "react-router";
import {
  getProjectById,
  getProjectRequests,
  updateRequestStatus,
} from "../services/mockProjectService";

function ProjectRequests() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [projectData, requestData] = await Promise.all([
        getProjectById(projectId),
        getProjectRequests(projectId),
      ]);
      setProject(projectData);
      if (!Array.isArray(requestData)) {
        throw new Error("Invalid requests data received.");
      }
      setRequests(requestData);
    } catch (error) {
      setLoadError(error.message || "Unable to load project requests.");
      setProject(null);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getProjectById(projectId), getProjectRequests(projectId)])
      .then(([projectData, requestData]) => {
        if (cancelled) return;
        if (!Array.isArray(requestData)) {
          throw new Error("Invalid requests data received.");
        }
        setProject(projectData);
        setRequests(requestData);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error.message || "Unable to load project requests.");
        setProject(null);
        setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function handleRequestAction(requestId, nextStatus) {
    if (updatingId !== null) return;
    setUpdatingId(requestId);
    setActionError("");
    setActionMessage("");

    try {
      const updated = await updateRequestStatus(requestId, nextStatus);
      setRequests((previous) =>
        previous.map((request) =>
          String(request.id) === String(updated.id) ? updated : request
        )
      );
      setActionMessage(
        nextStatus === "accepted"
          ? "Membership request accepted."
          : "Membership request rejected."
      );
    } catch (error) {
      setActionError(error.message || "Unable to update request.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        minWidth: 0,
        pb: 3,
        "& .MuiButton-root": { borderRadius: "8px", textTransform: "none", fontWeight: 700 },
        "& .MuiCard-root": { borderRadius: "16px", overflow: "hidden" },
        "& .MuiAlert-root": { borderRadius: "8px" },
        "& .MuiChip-root": { borderRadius: "8px" },
      }}
    >
      <Button
        component={Link}
        to="/my-projects"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2.5, px: 1.5 }}
      >
        Back to My Projects
      </Button>

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, sm: 34, md: 38 },
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            color: "#071739",
          }}
        >
          Project Requests
        </Typography>
        {project?.title && (
          <Chip
            label={project.title}
            size="small"
            sx={{
              alignSelf: "flex-start",
              maxWidth: "100%",
              bgcolor: "#E8EEF3",
              color: "#4B6382",
              fontWeight: 700,
              "& .MuiChip-label": {
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}
      </Stack>

      {loading && (
        <Card>
          <CardContent
            sx={{
              py: 8,
              display: "grid",
              placeItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress aria-label="Loading project requests" />
            <Typography color="text.secondary">Loading requests...</Typography>
          </CardContent>
        </Card>
      )}

      {!loading && loadError && (
        <Stack spacing={2}>
          <Alert severity="error">{loadError}</Alert>
          <Button
            onClick={loadData}
            variant="outlined"
            sx={{ alignSelf: "flex-start", borderColor: "#4B6382", color: "#071739" }}
          >
            Try Again
          </Button>
        </Stack>
      )}

      {!loading && !loadError && (
        <Stack spacing={2.5}>
          {actionMessage && <Alert severity="success">{actionMessage}</Alert>}
          {actionError && <Alert severity="error">{actionError}</Alert>}

          {requests.length === 0 ? (
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 5 }, minHeight: 280, display: "grid", placeItems: "center" }}>
                <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 3, maxWidth: 490 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#F0F3F8",
                      borderRadius: "16px",
                    }}
                  >
                    <PeopleOutlineRoundedIcon
                      sx={{ fontSize: 28, color: "#4B6382" }}
                    />
                  </Box>
                  <Typography variant="h6">No membership requests yet</Typography>
                  <Typography color="text.secondary">
                    Requests for this project will appear here when they are available.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Membership requests will appear here when someone applies to join.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => {
              const status = request.status || "unknown";
              const applicantName =
                request.applicantName ||
                request.userName ||
                request.applicant?.name ||
                "Applicant name unavailable";
              const isPending = status === "pending";
              const isUpdating = updatingId !== null;

              return (
                <Card key={request.id}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                      >
                        <Typography
                          variant="h6"
                          sx={{ overflowWrap: "anywhere", color: "#071739", fontWeight: 700 }}
                        >
                          {applicantName}
                        </Typography>
                        <Chip
                          label={status.charAt(0).toUpperCase() + status.slice(1)}
                          size="small"
                          color={
                            status === "accepted"
                              ? "success"
                              : status === "rejected"
                                ? "error"
                                : "default"
                          }
                          variant="outlined"
                        />
                      </Stack>

                      {request.message && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                        >
                          {request.message}
                        </Typography>
                      )}

                      <Divider />

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ pt: 0.5 }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ px: 3, minWidth: 100 }}
                          disabled={!isPending || isUpdating}
                          onClick={() => handleRequestAction(request.id, "accepted")}
                        >
                          {updatingId === request.id ? "Updating..." : "Accept"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ px: 3, minWidth: 100 }}
                          disabled={!isPending || isUpdating}
                          onClick={() => handleRequestAction(request.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      )}
    </Box>
  );
}

export default ProjectRequests;
