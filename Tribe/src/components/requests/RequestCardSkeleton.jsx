import { Box, Card, Skeleton } from "@mui/material";

/** کارت خاکستری موقع بارگذاری */
export default function RequestCardSkeleton() {
  return (
    <Card
      component="li"
      variant="outlined"
      aria-hidden="true"
      sx={{
        listStyle: "none",
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={80} height={18} />
        <Skeleton width={90} height={24} sx={{ borderRadius: 4 }} />
      </Box>
      <Skeleton width="85%" height={24} />
      <Skeleton width="55%" height={18} />
      <Skeleton width="100%" height={40} />
      <Skeleton width={72} height={32} sx={{ borderRadius: 1, mt: 0.5 }} />
    </Card>
  );
}
