import { Box, Container } from "@mui/material";
import SiteHeader from "../components/SiteHeader.jsx";

export default function DashboardLayout({ children }) {
  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", bgcolor: "#F3F5F7", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: 1120,
          px: { xs: 2, sm: 3, md: 3 },
          py: { xs: 2.5, sm: 3.5, md: 4 },
          flex: 1,
          boxSizing: "border-box",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
