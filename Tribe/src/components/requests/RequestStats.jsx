import { Box, Card, Typography } from "@mui/material";
import { fa } from "../../utils/fa";

const CARDS = [
  { key: "total", label: "کل درخواست‌ها", accent: "#071739" },
  { key: "pending", label: "در انتظار بررسی", accent: "#D7A36B" },
  { key: "accepted", label: "پذیرفته‌شده", accent: "#4FA67F" },
  { key: "rejected", label: "رد شده", accent: "#D9857B" },
];

export default function RequestStats({ counts }) {
  return (
    <Box
      component="ul"
      aria-label="خلاصه درخواست‌ها"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
        gap: { xs: 1.2, md: 2 },
        mb: { xs: 2.4, md: 3 },
      }}
    >
      {CARDS.map(({ key, label, accent }) => (
        <Card
          key={key}
          component="li"
          elevation={0}
          sx={{
            p: { xs: "12px 14px", md: "16px 20px" },
            borderRadius: "6px",
            bgcolor: "#fff",
            border: "1px solid #D9E0E7",
            boxShadow: "0 1px 3px rgba(7,23,57,.025)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 0.5,
            minHeight: { xs: 74, md: 92 },
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              insetInlineStart: 12,
              top: 14,
              bottom: 14,
              width: "3px",
              borderRadius: 2,
              bgcolor: accent,
            },
          }}
        >
          <Typography sx={{ color: "#718198", fontSize: { xs: 11.5, md: 12.5 }, lineHeight: 1.4, paddingInlineStart: 1.6 }}>
            {label}
          </Typography>
          <Typography
            component="strong"
            sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, color: "#071739", lineHeight: 1.15, paddingInlineStart: 1.6 }}
          >
            {counts ? fa(counts[key]) : "—"}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
