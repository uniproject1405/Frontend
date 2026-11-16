
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
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";

import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  closeProject,
  getMyProjects,
} from "../services/mockProjectService";
import { fa } from "../utils/fa";
import ProjectCard from "../components/ProjectCard";
import MembershipTabs from "../components/MembershipTabs";
import CloseProjectDialog from "../components/CloseProjectDialog";

function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = ["joined", "requests", "review"].includes(searchParams.get("tab")) ? searchParams.get("tab") : "created";

  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [closeTarget, setCloseTarget] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState("");
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

  function handleClose(project) {
    if (!project?.id) return;
    setCloseError("");
    setCloseTarget(project);
  }

  async function confirmClose(project) {
    setIsClosing(true);
    setCloseError("");

    try {
      const updatedProject = await closeProject(project.id);

      setProjects((currentProjects) =>
        currentProjects.map((item) =>
          String(item.id) === String(updatedProject.id)
            ? updatedProject
            : item
        )
      );

      setCloseTarget(null);
      setToast("پروژه با موفقیت بسته شد.");
    } catch (error) {
      console.error("Failed to close project:", error);
      setCloseError(error.message || "بستن پروژه انجام نشد.");
    } finally {
      setIsClosing(false);
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
      width: "100%",
      maxWidth: "1500px",
      mx: "auto",
      boxSizing: "border-box",
    }}
  >
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast("")}
          severity={
            toast.includes("انجام نشد") ||
            toast.includes("ناموفق")
              ? "error"
              : "success"
          }
          variant="filled"
          sx={{ boxShadow: 3 }}
        >
          {toast}
        </Alert>
      </Snackbar>

      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#071739" }}>پروژه‌های من</Typography>
        <Button component={Link} to="/create-project" variant="contained" startIcon={<AddRoundedIcon />}>پروژه جدید</Button>
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, v) => setSearchParams(v === "created" ? {} : { tab: v })}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="created" label="ساخته‌شده" />
        <Tab value="review" label="برای بررسی" />
        <Tab value="joined" label="عضو شده" />
        <Tab value="requests" label="درخواست‌های ارسالی" />
      </Tabs>

      {tab !== "created" && <MembershipTabs key={tab} tab={tab} onToast={setToast} />}

      {tab === "created" && (<>
      {/* SECTION HEADING */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 2.5 }}
      >
        {isConnected && (
          <Chip
            label={`${fa(projects.length)} پروژه`}
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
              در حال بارگذاری پروژه‌ها...
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
              بارگذاری پروژه‌ها ممکن نشد
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              هنگام بارگذاری پروژه‌ها مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={loadProjects}
            >
              تلاش دوباره
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
              هنوز پروژه‌ای ندارید
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 420, mb: 3 }}
            >
              هنوز پروژه‌ای نساخته‌اید. اولین پروژه‌تان را بسازید.
            </Typography>

            <Button
              component={Link}
              to="/create-project"
              variant="outlined"
              startIcon={<AddRoundedIcon />}
            >
              ساخت اولین پروژه
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
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
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
      </>)}

      <CloseProjectDialog
        open={Boolean(closeTarget)}
        project={closeTarget}
        isClosing={isClosing}
        error={closeError}
        onCancel={() => setCloseTarget(null)}
        onConfirm={confirmClose}
      />
    </Box>
  );
}

export default MyProjects;