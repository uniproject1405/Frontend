import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";

import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  closeProject,
  getMyProjects,
} from "../services/projectService";
import { fa } from "../utils/fa";
import ProjectCard from "../components/ProjectCard";
import MembershipTabs from "../components/MembershipTabs";
import MyRequestsSection from "../components/requests/MyRequestsSection";
import CloseProjectDialog from "../components/CloseProjectDialog";
import currentUser from "../services/currentUser";
import { getOwner, readRequests, useMyStats } from "../services/membershipService";

const COLORS = {
  navy: "#071739",
  blue: "#4B6382",
  muted: "#A4B5C4",
  border: "#DBE5F0",
  beige: "#E3C39D",
  brown: "#A68868",
  white: "#FFFFFF",
};

function normalizeStatus(project) {
  const status = String(project?.status || "").toLowerCase();

  if (["closed", "completed", "archived"].includes(status)) {
    return "closed";
  }

  if (["review", "in review", "pending"].includes(status)) {
    return "review";
  }

  return "active";
}

function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = ["joined", "requests", "review"].includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "created";

  const stats = useMyStats();
  const openTab = (value) => setSearchParams(value === "created" ? {} : { tab: value }, { replace: true });

  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [closeTarget, setCloseTarget] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState("");
  const [toast, setToast] = useState(
    location.state?.message || ""
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

  const loadProjects = useCallback(async () => {
    setStatus("loading");

    try {
      const data = await getMyProjects();
      // The store holds everyone's projects; this tab lists only the ones you own,
      // the same rule the Profile page uses. Request counts feed the card badges.
      const requests = readRequests();
      const count = (id, state) =>
        requests.filter((r) => String(r.projectId) === String(id) && r.status === state).length;
      setProjects(
        (Array.isArray(data) ? data : [])
          .filter((p) => getOwner(p.id).id === currentUser.id)
          .map((p) => ({ ...p, accepted: count(p.id, "accepted"), pending: count(p.id, "pending") }))
      );
      setStatus("success");
    } catch (error) {
      console.error("Failed to load projects:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Schedule the initial load after the effect to avoid synchronous state updates.
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadProjects]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 3000);

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

      setProjects((current) =>
        current.map((item) =>
          String(item.id) === String(updatedProject.id)
            ? { ...item, ...updatedProject }
            : item
        )
      );

      setCloseTarget(null);
      setToast("پروژه با موفقیت بسته شد.");
    } catch (error) {
      console.error("Failed to close project:", error);
      setCloseError(error.message || "بستن پروژه امکان‌پذیر نبود.");
    } finally {
      setIsClosing(false);
    }
  }

  function handleEdit(project) {
    if (project?.id == null) return;

    navigate(
      `/my-projects/${encodeURIComponent(project.id)}/edit`
    );
  }

  function handleRequests(project) {
    if (project?.id == null) return;

    navigate(
      `/my-projects/${encodeURIComponent(project.id)}/requests`
    );
  }

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const items = projects.filter((project) => {
      const matchesSearch =
        !query ||
        [
          project.title,
          project.description,
          project.category,
          project.goal,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "all" ||
        normalizeStatus(project) === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...items].sort((a, b) => {
      if (sortBy === "title") {
        return String(a.title || "").localeCompare(
          String(b.title || "")
        );
      }

      const getDate = (project) => {
        const value =
          project.updatedAt ||
          project.createdAt ||
          project.date;

        const time = value ? new Date(value).getTime() : 0;
        return Number.isFinite(time) ? time : 0;
      };

      return sortBy === "oldest"
        ? getDate(a) - getDate(b)
        : getDate(b) - getDate(a);
    });
  }, [projects, search, statusFilter, sortBy]);

  const isLoading = status === "loading";
  const hasError = status === "error";
  const isConnected = status === "success";


  return (
    <Box dir="rtl" sx={{ width: "100%", minWidth: 0 }}>
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast("")}
          severity={
            /نمی‌توان|امکان‌پذیر نبود|ناموفق|نشد|خطا|could not|failed|unable/i.test(toast)
              ? "error"
              : "success"
          }
          variant="filled"
        >
          {toast}
        </Alert>
      </Snackbar>

      {/* Same heading shape as Explore, so My Projects reads as part of one app. */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" color={COLORS.navy} sx={{ fontWeight: 800 }}>
          پروژه‌های من
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          پروژه‌هایی که ساخته‌اید، تیم‌هایی که عضوشان هستید و درخواست‌هایتان، در یک جا.
        </Typography>
      </Box>

      {/* One stat per tab; each opens its tab. Replaces the old sidebar summary. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {[
          { value: "created", count: stats.created, label: "پروژه‌ی ساخته‌شده" },
          { value: "review", count: stats.toReview, label: "درخواست منتظر پاسخ شما", alert: true },
          { value: "joined", count: stats.joined, label: "تیمی که عضوش هستید" },
          { value: "requests", count: stats.waiting, label: "درخواست ارسالی در انتظار" },
        ].map((item) => {
          const selected = tab === item.value;
          return (
            <Box
              key={item.value}
              component="button"
              type="button"
              aria-pressed={selected}
              onClick={() => openTab(item.value)}
              sx={{
                textAlign: "start", cursor: "pointer", font: "inherit", p: 2, borderRadius: 3,
                border: "1px solid", borderColor: selected ? COLORS.navy : "#E3E8EF",
                bgcolor: selected ? "#F3F6FA" : "#FFFFFF", transition: "border-color .2s",
                "&:hover": { borderColor: COLORS.navy },
                "&:focus-visible": { outline: `3px solid ${COLORS.brown}`, outlineOffset: 2 },
              }}
            >
              <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: item.alert && item.count ? "error.main" : COLORS.navy }}>
                {fa(item.count)}
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: COLORS.blue, mt: 0.5 }}>{item.label}</Typography>
            </Box>
          );
        })}
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => openTab(value)}
        variant="scrollable"
        scrollButtons={false}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider", "& .MuiTab-root": { minWidth: 0, px: { xs: 1.5, sm: 2 } } }}
      >
        <Tab value="created" label="ساخته‌شده" />
        <Tab value="review" label="برای بررسی" />
        <Tab value="joined" label="عضوشده" />
        <Tab value="requests" label="ارسالی" />
      </Tabs>

      {tab === "requests" ? (
        <MyRequestsSection onToast={setToast} />
      ) : tab !== "created" ? (
        <MembershipTabs key={tab} tab={tab} onToast={setToast} />
      ) : (
      <>
      {/* Main + right sidebar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
          },
          gap: { xs: 2.5, lg: 2 },
          alignItems: "start",
        }}
      >
        {/* LEFT PROJECT AREA */}
        <Box
          sx={{
            minWidth: 0,
            borderRadius: "16px",
            border: "1px solid #E3E8EF",
            background: "#FFFFFF",
            p: { xs: 1.4, sm: 2, xl: 2.2 },
          }}
        >
          {/* Search and filters */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.2,
              mb: 3,
            }}
          >
            <TextField
              size="small"
              placeholder="جست‌وجو در پروژه‌های من..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              sx={{
                flex: "1 1 200px",
                maxWidth: { lg: 310 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: 12.5,
                },
              }}
              slotProps={{
                input: { startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: "#27628E" }}
                    />
                  </InputAdornment>
                ) },
              }}
            />

            <FormControl size="small">
              <Select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: 12,
                  minWidth: 125,
                }}
              >
                <MenuItem value="all">همه پروژه‌ها</MenuItem>
                <MenuItem value="active">در حال جذب عضو</MenuItem>
                <MenuItem value="closed">جذب عضو بسته</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: 12,
                  minWidth: 145,
                }}
              >
                <MenuItem value="recent">
                  آخرین به‌روزرسانی
                </MenuItem>
                <MenuItem value="oldest">قدیمی‌ترین</MenuItem>
                <MenuItem value="title">نام پروژه</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={0.5}>
              <IconButton
                aria-label="نمای شبکه‌ای"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                sx={{
                  borderRadius: "11px",
                  color: COLORS.navy,
                  bgcolor:
                    viewMode === "grid"
                      ? "#DEEAF7"
                      : "transparent",
                }}
              >
                <GridViewRoundedIcon />
              </IconButton>

              <IconButton
                aria-label="نمای فهرستی"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                sx={{
                  borderRadius: "11px",
                  color: COLORS.navy,
                  bgcolor:
                    viewMode === "list"
                      ? "#DEEAF7"
                      : "transparent",
                }}
              >
                <ViewListRoundedIcon />
              </IconButton>
            </Stack>
          </Box>

          {isLoading && (
            <Card>
              <CardContent
                sx={{
                  minHeight: 320,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                }}
              >
                <Stack spacing={2} sx={{ alignItems: "center" }}>
                  <CircularProgress />
                  <Typography color="text.secondary">
                    در حال بارگذاری پروژه‌ها...
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {hasError && (
            <Card>
              <CardContent
                sx={{
                  minHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  gap: 2,
                }}
              >
                <CloudOffRoundedIcon
                  sx={{ fontSize: 45, color: "error.main" }}
                />

                <Typography variant="h6">
                  بارگذاری پروژه‌ها با خطا مواجه شد
                </Typography>

                <Button
                  onClick={loadProjects}
                  variant="outlined"
                  startIcon={<RefreshRoundedIcon />}
                >
                  تلاش دوباره
                </Button>
              </CardContent>
            </Card>
          )}

          {isConnected && projects.length === 0 && (
            <Card>
              <CardContent
                sx={{
                  minHeight: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  gap: 2,
                }}
              >
                <FolderOpenRoundedIcon
                  sx={{ fontSize: 52, color: COLORS.blue }}
                />

                <Typography variant="h6">
                  هنوز پروژه‌ای ندارید
                </Typography>

                <Typography color="text.secondary">
                  برای شروع، اولین پروژه خود را ایجاد کنید.
                </Typography>

                <Button
                  component={Link}
                  to="/create-project"
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                >
                  ایجاد پروژه
                </Button>
              </CardContent>
            </Card>
          )}

          {isConnected &&
            projects.length > 0 &&
            visibleProjects.length === 0 && (
              <Box
                sx={{
                  py: 9,
                  textAlign: "center",
                  color: COLORS.blue,
                }}
              >
                <SearchRoundedIcon sx={{ fontSize: 42 }} />

                <Typography sx={{ mt: 1, fontWeight: 600 }}>
                  پروژه‌ای مطابق جست‌وجو یا فیلترهای انتخاب‌شده پیدا نشد.
                </Typography>

                <Button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  پاک کردن فیلترها
                </Button>
              </Box>
            )}

          {/* Project cards */}
          {isConnected && visibleProjects.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                 viewMode === "list"
                    ? "minmax(0, 1fr)"
                    : {
                        xs: "minmax(0, 1fr)",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                      },
                gap: { xs: 2, lg: 2 },
                alignItems: "stretch",
              }}
            >
              {visibleProjects.map((project) => (
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

      </Box>
      </>
      )}

      <CloseProjectDialog
        open={Boolean(closeTarget)}
        project={closeTarget}
        onCancel={() => {
          if (!isClosing) {
            setCloseTarget(null);
            setCloseError("");
          }
        }}
        onConfirm={confirmClose}
        isClosing={isClosing}
        error={closeError}
      />
    </Box>
  );
}

export default MyProjects;
