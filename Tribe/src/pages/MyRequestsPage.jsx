import { useEffect, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import MyRequestsPanel from "../components/requests/MyRequestsPanel";
import { getMyRequests } from "../services/membershipService";

export default function MyRequestsPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyRequests()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "بارگذاری درخواست‌ها ممکن نشد.");
      });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  return (
    <DashboardLayout>
      <Box dir="rtl" sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={3000}
          onClose={() => setToast("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setToast("")}
            severity={toast.includes("نشد") || toast.includes("ناموفق") ? "error" : "success"}
            variant="filled"
          >
            {toast}
          </Alert>
        </Snackbar>
        <MyRequestsPanel
          items={items}
          error={error}
          loading={!items && !error}
          onReload={() => setReload((value) => value + 1)}
          onToast={setToast}
        />
      </Box>
    </DashboardLayout>
  );
}
