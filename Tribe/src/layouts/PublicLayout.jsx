import { Outlet } from "react-router";
import { Box, Container } from "@mui/material";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

// Public shell from the explore design: header, page, footer.
export default function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F4F6F8", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <SiteFooter />
    </Box>
  );
}
