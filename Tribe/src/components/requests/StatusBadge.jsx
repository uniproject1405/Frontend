import { Chip } from "@mui/material";
import { REQUEST_STATUS } from "../../utils/requestStatus";

const STYLES = {
  pending: { bgcolor: "#F6EBDB", color: "#6B4A1E" },
  accepted: { bgcolor: "#DDF1E6", color: "#14573A" },
  rejected: { bgcolor: "#FBE4E1", color: "#9B2F25" },
};

export default function StatusBadge({ status, size = "small" }) {
  const meta = REQUEST_STATUS[status] || REQUEST_STATUS.pending;
  const style = STYLES[status] || STYLES.pending;

  return (
    <Chip
      size={size}
      label={meta.label}
      sx={{
        fontWeight: 700,
        fontSize: size === "small" ? 11 : 12.5,
        height: size === "small" ? 24 : 28,
        borderRadius: "3px",
        border: "none",
        ...style,
        "& .MuiChip-label": { px: 1.3 },
      }}
    />
  );
}
