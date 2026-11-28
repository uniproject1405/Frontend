import { useEffect, useState } from "react";

import MyRequestsPanel from "./MyRequestsPanel";
import { getMyRequests } from "../../services/membershipService";

// Negar's My Requests page, shown as the "sent requests" tab of My Projects.
export default function MyRequestsSection({ onToast }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

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
    <MyRequestsPanel
      items={items}
      error={error}
      loading={!items && !error}
      onReload={() => {
        setError("");
        setReload((value) => value + 1);
      }}
      onToast={onToast}
    />
  );
}
