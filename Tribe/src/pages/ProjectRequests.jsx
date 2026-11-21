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
        throw new Error("اطلاعات درخواست‌ها معتبر نیست.");
      }
      setRequests(requestData);
    } catch (error) {
      setLoadError(error.message || "بارگذاری درخواست‌های پروژه انجام نشد.");
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
          throw new Error("اطلاعات درخواست‌ها معتبر نیست.");
        }
        setProject(projectData);
        setRequests(requestData);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error.message || "بارگذاری درخواست‌های پروژه انجام نشد.");
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
          ? "درخواست عضویت با موفقیت پذیرفته شد."
          : "درخواست عضویت رد شد."
      );
    } catch (error) {
      setActionError(error.message || "به‌روزرسانی درخواست انجام نشد.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
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
        بازگشت به پروژه‌های من
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
          درخواست‌های عضویت پروژه
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
            <CircularProgress aria-label="در حال بارگذاری درخواست‌های پروژه" />
            <Typography color="text.secondary">در حال بارگذاری درخواست‌ها...</Typography>
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
            تلاش مجدد
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
                <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 3, maxWidth: 490 }}>
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
                  <Typography variant="h6">هنوز درخواست عضویتی ثبت نشده است</Typography>
                  <Typography color="text.secondary">
                    درخواست‌های مربوط به این پروژه در این بخش نمایش داده می‌شوند.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    هر زمان فردی برای عضویت در پروژه درخواست ارسال کند، درخواست او در این بخش نمایش داده می‌شود.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            (() => {
              const acceptedCount = requests.filter((item) => item.status === "accepted").length;
              const full = Number(project?.capacity) > 0 && acceptedCount >= Number(project.capacity);
              return requests.map((request) => {
                const status = request.status || "unknown";
                const applicantName =
                  request.applicantName ||
                  request.userName ||
                  request.applicant?.name ||
                  "نام متقاضی در دسترس نیست";
                const isPending = status === "pending";
                const statusLabel = {
                  pending: "در انتظار بررسی",
                  accepted: "پذیرفته‌شده",
                  rejected: "ردشده",
                }[status] || "نامشخص";
                const isUpdating = updatingId !== null;

                return (
                  <Card key={request.id}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack spacing={2}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ overflowWrap: "anywhere", color: "#071739", fontWeight: 700 }}
                          >
                            {applicantName}
                          </Typography>
                          <Chip
                            label={statusLabel}
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
                            disabled={!isPending || isUpdating || full}
                            onClick={() => handleRequestAction(request.id, "accepted")}
                          >
                            {full && isPending
                              ? "ظرفیت تکمیل"
                              : updatingId === request.id
                                ? "در حال ثبت..."
                                : "پذیرفتن"}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ px: 3, minWidth: 100 }}
                            disabled={!isPending || isUpdating}
                            onClick={() => handleRequestAction(request.id, "rejected")}
                          >
                            رد درخواست
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              });
            })()
          )}
        </Stack>
      )}
    </Box>
  );
}

export default ProjectRequests;
