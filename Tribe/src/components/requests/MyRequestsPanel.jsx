import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";

import { fa } from "../../utils/fa";
import {
  REQUEST_STATUS,
  countByStatus,
  normalizeText,
} from "../../utils/requestStatus";
import { withdrawRequest } from "../../services/membershipService";
import RequestStats from "./RequestStats";
import RequestFilters from "./RequestFilters";
import RequestCard from "./RequestCard";
import RequestCardSkeleton from "./RequestCardSkeleton";
import RequestDetailsDialog from "./RequestDetailsDialog";

/**
 * پنل غنی «درخواست‌های ارسال‌شده من»
 * سازگار با داده membershipService.getMyRequests()
 * شکل هر آیتم: { request, project, owner? }
 */
export default function MyRequestsPanel({
  items,
  error,
  loading,
  onReload,
  onToast,
}) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toWithdraw, setToWithdraw] = useState(null);

  const list = useMemo(() => items || [], [items]);

  const counts = useMemo(
    () => (loading || error ? null : countByStatus(list)),
    [loading, error, list]
  );

  const visible = useMemo(() => {
    const term = normalizeText(search);
    return list.filter((item) => {
      const statusOk = filter === "all" || item.request?.status === filter;
      const titleOk =
        !term || normalizeText(item.project?.title).includes(term);
      return statusOk && titleOk;
    });
  }, [list, filter, search]);

  // فوکوس را از دکمه‌ی فشرده‌شده بردار تا هنگام باز شدن دیالوگ، aria-hidden روی عنصر فوکوس‌دار نیفتد
  function blurActive() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  function openWithdraw(item) {
    blurActive();
    setToWithdraw(item);
  }

  function openDetails(item) {
    blurActive();
    setSelected(item);
    setDialogOpen(true);
  }

  function handleQueryChange(value) {
    setQuery(value);
    if (!value.trim()) setSearch("");
  }

  function clearFilters() {
    setFilter("all");
    setQuery("");
    setSearch("");
  }

  async function confirmWithdraw() {
    const id = toWithdraw?.request?.id;
    setToWithdraw(null);
    if (!id) return;
    try {
      await withdrawRequest(id);
      onToast?.("درخواست پس گرفته شد");
      onReload?.();
    } catch (e) {
      onToast?.(e.message || "پس گرفتن درخواست انجام نشد.");
    }
  }

  const statusLabel = filter === "all" ? "" : REQUEST_STATUS[filter]?.label;
  let countText = `${fa(visible.length)} درخواست ارسال‌شده`;
  if (search.trim()) {
    countText = `${fa(visible.length)} نتیجه برای «${search.trim()}»`;
    if (statusLabel) countText += ` در وضعیت «${statusLabel}»`;
  } else if (statusLabel) {
    countText = `${fa(visible.length)} درخواست با وضعیت «${statusLabel}»`;
  }

  if (loading) {
    return (
      <Box>
        <RequestStats counts={null} />
        <Box
          component="ul"
          aria-busy="true"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {[0, 1, 2, 3].map((n) => (
            <RequestCardSkeleton key={n} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Card
        variant="outlined"
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <CloudOffRoundedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        <Typography variant="h6">دریافت درخواست‌ها ممکن نشد</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
          اتصال اینترنت را بررسی کنید و دوباره تلاش کنید. درخواست‌های شما محفوظ هستند.
        </Typography>
        <Button variant="contained" onClick={onReload} sx={{ mt: 1 }}>
          تلاش دوباره
        </Button>
      </Card>
    );
  }

  if (list.length === 0) {
    return (
      <Card
        variant="outlined"
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <InboxRoundedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        <Typography variant="h6">هنوز درخواستی ارسال نکرده‌اید</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
          با پیدا کردن یک پروژه مناسب، اولین قدم همکاری را بردارید.
        </Typography>

      </Card>
    );
  }

  return (
    <Box>
      {/* My Projects already shows the page title; this tab starts at its stats. */}
      <RequestStats counts={counts} />

      <RequestFilters
        filter={filter}
        onFilterChange={setFilter}
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={() => setSearch(query.trim())}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.8, fontSize: { xs: 12, md: 12.5 }, textAlign: "start" }}
        aria-live="polite"
      >
        {countText}
      </Typography>

      {visible.length > 0 ? (
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
            },
            gap: { xs: 1.5, md: 2.2 },
          }}
        >
          {visible.map((item) => (
            <RequestCard
              key={item.request.id}
              item={item}
              onOpen={openDetails}
              onWithdraw={openWithdraw}
            />
          ))}
        </Box>
      ) : (
        <Card
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
          <Typography variant="h6">درخواستی پیدا نشد</Typography>
          <Typography color="text.secondary">
            با این جست‌وجو یا فیلتر، درخواستی وجود ندارد.
          </Typography>
          <Button variant="outlined" onClick={clearFilters}>
            پاک کردن فیلترها
          </Button>
        </Card>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 3, textAlign: "center", fontSize: { xs: 11, md: 12 } }}
      >
        این صفحه فقط درخواست‌هایی را نشان می‌دهد که شما برای پیوستن به پروژه‌های دیگران ارسال کرده‌اید.
      </Typography>

      <RequestDetailsDialog
        item={selected}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onWithdraw={openWithdraw}
      />

      <Dialog open={Boolean(toWithdraw)} onClose={() => setToWithdraw(null)}>
        <DialogTitle>درخواست پس گرفته شود؟</DialogTitle>
        <DialogContent>
          <DialogContentText>
            مالک پروژه دیگر درخواست شما برای پیوستن به{" "}
            {toWithdraw?.project?.title} را نخواهد دید.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToWithdraw(null)}>نگه داشتن</Button>
          <Button color="error" onClick={confirmWithdraw}>
            بله، پس می‌گیرم
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
