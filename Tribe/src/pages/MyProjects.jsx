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
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import CreateProject from "./CreateProject";

import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import {
  closeProject,
  getMyProjects,
} from "../services/mockProjectService";
import { fa } from "../utils/fa";
import ProjectCard from "../components/ProjectCard";
import MembershipTabs from "../components/MembershipTabs";
import CloseProjectDialog from "../components/CloseProjectDialog";

const COLORS = {
  navy: "#071739",
  blue: "#4B6382",
  muted: "#A4B5C4",
  border: "#DBE5F0",
  beige: "#E3C39D",
  brown: "#A68868",
  white: "#FFFFFF",
};

const panelStyle = {
  bgcolor: "#FFFFFF",
  border: "1px solid #E3E8EF",
  borderRadius: "16px",
  boxShadow: "0 3px 14px rgba(11, 27, 59, 0.025)",
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

function SummaryItem({ icon, value, label, tone = "blue" }) {
  const tones = {
    blue: { bg: "#EEF2F6", fg: "#0B1B3B" },
    green: { bg: "#EAF3EF", fg: "#36765F" },
    beige: { bg: "#F4EDE5", fg: "#8B6E50" },
    gray: { bg: "#F0F2F5", fg: "#64748B" },
  };
  const selected = tones[tone];

  return (
    <Box
      sx={{
        minWidth: 0,
        minHeight: 96,
        p: 1.45,
        border: "1px solid #E3E8EF",
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      <Box sx={{
        width: 35, height: 35, borderRadius: "10px",
        display: "grid", placeItems: "center",
        bgcolor: selected.bg, color: selected.fg,
        "& svg": { fontSize: 20 },
      }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "#0B1B3B", fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}>
          {fa(value)}
        </Typography>
        <Typography sx={{ color: "#4B6382", fontSize: 11, mt: 0.3, lineHeight: 1.45 }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

function CreateProjectPanel({ onOpen }) {
  return (
    <Box sx={{ ...panelStyle, p: { xs: 2.5, lg: 2.7 } }}>
      <Typography sx={{
        color: "#697B92", fontSize: 10.5, fontWeight: 700,
        letterSpacing: 0.55, mb: 2.2,
      }}>
        ایده‌ای ارزشمند را آغاز کنید
      </Typography>

      <Box sx={{
        width: 50, height: 50, display: "grid", placeItems: "center",
        borderRadius: "13px", bgcolor: "#EEF2F6", color: "#0B1B3B", mb: 2,
      }}>
        <LaptopMacRoundedIcon sx={{ fontSize: 28 }} />
      </Box>

      <Typography sx={{
        color: "#0B1B3B", fontSize: { xs: 21, lg: 22 },
        fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.35,
      }}>
        ایجاد پروژه جدید
      </Typography>
      <Typography sx={{
        color: "#4B6382", fontSize: 12.5, lineHeight: 1.85,
        mt: 1.3, mb: 2.7,
      }}>
        پروژه‌ای تازه بسازید، همکاران خود را دعوت کنید و در کنار هم ایده‌ای ارزشمند را به واقعیت تبدیل کنید.
      </Typography>

      <Button
        onClick={onOpen}
        fullWidth
        variant="contained"
        startIcon={<AddRoundedIcon />}
        sx={{
          minHeight: 45, borderRadius: "10px", bgcolor: "#0B1B3B",
          color: "#FFFFFF", fontSize: 13, fontWeight: 700,
          boxShadow: "none", textTransform: "none",
          "&:hover": { bgcolor: "#182D55", boxShadow: "none" },
        }}
      >
        ایجاد پروژه
      </Button>
    </Box>
  );
}

function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = ["joined", "requests", "review"].includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "created";

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
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
            ? updatedProject
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

  const summary = useMemo(() => {
    const counts = {
      total: projects.length,
      active: 0,
      review: 0,
      closed: 0,
    };

    projects.forEach((project) => {
      counts[normalizeStatus(project)] += 1;
    });

    return counts;
  }, [projects]);

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

  // This panel links to actual project request pages.
  // We do not invent applicant names or request counts.
  const recentProjectLinks = projects.slice(0, 3);

  return (
    <Box dir="rtl" sx={{ width: "100%", minWidth: 0 }}>
      <CreateProject
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={loadProjects}
        />
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast("")}
          severity={
            /نمی‌توان|امکان‌پذیر نبود|ناموفق|خطا|could not|failed|unable/i.test(toast)
              ? "error"
              : "success"
          }
          variant="filled"
        >
          {toast}
        </Alert>
      </Snackbar>

      {/* Page heading styled to match the team's Explore/Create pages. */}
      <Box sx={{ mb: 3, px: { xs: 0, sm: 0.5 } }}>
        <Typography
          sx={{
            color: COLORS.blue,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            mb: 1.2,
          }}
        >
          فضای مدیریت پروژه‌های شما
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 30, sm: 35, md: 38 },
            letterSpacing: "-0.8px",
            fontWeight: 700,
            color: COLORS.navy,
            lineHeight: 1.3,
          }}
        >
          پروژه‌های من
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 13, md: 14 },
            color: COLORS.blue,
            lineHeight: 1.8,
            mt: 0.8,
            maxWidth: 700,
          }}
        >
          همه پروژه‌ها، درخواست‌های عضویت و تنظیمات پروژه‌های خود را مدیریت کنید.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => setSearchParams(value === "created" ? {} : { tab: value }, { replace: true })}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="created" label="ساخته‌شده" />
        <Tab value="review" label="برای بررسی" />
        <Tab value="joined" label="عضو شده" />
        <Tab value="requests" label="درخواست‌های ارسالی" />
      </Tabs>

      {tab !== "created" ? (
        <MembershipTabs key={tab} tab={tab} onToast={setToast} />
      ) : (
      <>
      {/* Main + right sidebar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) 290px",
            xl: "minmax(0, 1fr) 310px",
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
                <MenuItem value="active">در حال انجام</MenuItem>
                <MenuItem value="review">در انتظار بررسی</MenuItem>
                <MenuItem value="closed">بسته‌شده</MenuItem>
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

        {/* RIGHT SIDEBAR */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          <CreateProjectPanel
            onOpen={() => setCreateModalOpen(true)}
          />

          {/* Project summary â€” matching the team's understated white cards */}
          <Box sx={{ ...panelStyle, p: { xs: 2.5, lg: 2.7 } }}>
            <Typography sx={{
              fontWeight: 700, fontSize: 10.5, letterSpacing: 0.55,
              color: "#697B92", mb: 1,
            }}>
              نگاهی کلی به پروژه‌های شما
            </Typography>
            <Typography sx={{
              fontWeight: 700, color: "#0B1B3B", fontSize: 19,
              mb: 2.3, lineHeight: 1.4,
            }}>
              خلاصه پروژه‌های من
            </Typography>
            <Box sx={{
              display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1.25,
            }}>
              <SummaryItem icon={<FolderOutlinedIcon />} value={summary.total} label="مجموع پروژه‌ها" />
              <SummaryItem icon={<PlayArrowRoundedIcon />} value={summary.active} label="در حال انجام" tone="green" />
              <SummaryItem icon={<TaskAltRoundedIcon />} value={summary.review} label="در انتظار بررسی" tone="beige" />
              <SummaryItem icon={<Inventory2OutlinedIcon />} value={summary.closed} label="بسته‌شده" tone="gray" />
            </Box>
          </Box>

          {/* Membership requests: link-only presentation; no fabricated counts */}
          <Box sx={{ ...panelStyle, p: { xs: 2.5, lg: 2.7 } }}>
            <Typography sx={{
              fontWeight: 700, fontSize: 10.5, letterSpacing: 0.55,
              color: "#697B92", mb: 1,
            }}>
              تیم شما
            </Typography>
            <Typography sx={{
              fontWeight: 700, color: "#0B1B3B", fontSize: 18,
              lineHeight: 1.4, mb: 1,
            }}>
              درخواست‌های عضویت اخیر
            </Typography>
            <Typography sx={{
              color: "#4B6382", fontSize: 12, lineHeight: 1.8, mb: 1.8,
            }}>
              برای بررسی درخواست‌های عضویت، یک پروژه را انتخاب کنید.
            </Typography>

            {recentProjectLinks.length === 0 ? (
              <Box sx={{ py: 2.5, textAlign: "center", color: "#4B6382" }}>
                <GroupsOutlinedIcon sx={{ fontSize: 29, mb: 0.7 }} />
                <Typography sx={{ fontSize: 12 }}>پروژه‌ای برای بررسی وجود ندارد.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {recentProjectLinks.map((project) => (
                  <Box
                    key={project.id}
                    component="button"
                    type="button"
                    onClick={() => handleRequests(project)}
                    sx={{
                      width: "100%",
                      minHeight: 70,
                      py: 1.4,
                      px: 1.6,
                      border: "1px solid #0B1B3B",
                      bgcolor: "#0B1B3B",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "start",
                      gap: 1.3,
                      cursor: "pointer",
                      borderRadius: "18px",
                      transition: "background-color .2s ease, transform .2s ease",
                      "&:hover": { bgcolor: "#19325D", transform: "translateY(-1px)" },
                      "&:focus-visible": { outline: "3px solid #A68868", outlineOffset: 2 },
                    }}
                  >
                    <Box sx={{
                      width: 37,
                      height: 37,
                      borderRadius: "11px",
                      bgcolor: "rgba(255,255,255,0.13)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}>
                      <GroupsOutlinedIcon sx={{ fontSize: 19 }} />
                    </Box>
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography sx={{
                        color: "#FFFFFF",
                        fontSize: 12.5,
                        fontWeight: 700,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {project.title || "پروژه بدون عنوان"}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#D6E0EF", mt: 0.35 }}>
                        مشاهده درخواست‌ها
                      </Typography>
                    </Box>
                    <ArrowForwardRoundedIcon sx={{ color: "#FFFFFF", fontSize: 20, flexShrink: 0 }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
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
