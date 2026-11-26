import { useState } from "react";
import {
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import currentUser from "../services/currentUser";

const NAV_ITEMS = ["پروژه‌ها", "پیدا کردن هم‌تیمی", "تبادل مهارت", "درخواست‌های من"];
const ACTIVE = "درخواست‌های من";

export default function SiteHeader() {
  const userName = currentUser?.name || "کاربر";
  const [open, setOpen] = useState(false);

  return (
    <Box
      component="header"
      sx={{ bgcolor: "#fff", borderBottom: "1px solid #E2E7EC", width: "100%", position: "sticky", top: 0, zIndex: 10 }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1360,
          minHeight: { xs: 64, md: 76 },
          px: { xs: 2, sm: 3, md: 5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* لوگو — اول در DOM → سمت راست */}
        <Box component="a" href="/" aria-label="Tribe" sx={{ display: "inline-flex", flexShrink: 0 }}>
          <Box
            component="img"
            src="/tribe-logo-primary.svg"
            alt="Tribe"
            sx={{ height: { xs: 38, md: 48 }, width: "auto", display: "block" }}
          />
        </Box>

        {/* منو (از md به بالا) — بلافاصله بعد از لوگو، به سمت چپ */}
        <Stack
          component="nav"
          direction="row"
          spacing={{ md: 3, lg: 4.5 }}
          sx={{
            alignItems: "stretch",
            alignSelf: "stretch",
            display: { xs: "none", md: "flex" },
            flex: 1,
            justifyContent: "flex-start",
            ms: { md: 4, lg: 7 },
          }}
        >
          {NAV_ITEMS.map((label) => {
            const active = label === ACTIVE;
            return (
              <Box
                key={label}
                component="a"
                href="#"
                aria-current={active ? "page" : undefined}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: active ? "#071739" : "#536783",
                  fontSize: 13.5,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  borderBottom: active ? "2px solid #A68868" : "2px solid transparent",
                  mb: "-1px",
                  fontWeight: active ? 700 : 400,
                  "&:hover": { color: "#071739" },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Stack>

        {/* نام کاربر — آخر در DOM → سمت چپ */}
        <Typography
          sx={{
            color: "#071739",
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: "nowrap",
            display: { xs: "none", md: "block" },
          }}
        >
          {userName}
        </Typography>

        {/* منوی همبرگری برای موبایل و تبلت */}
        <IconButton
          aria-label="باز کردن منو"
          onClick={(e) => {
            e.currentTarget.blur();
            setOpen(true);
          }}
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "#071739" }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: 280 } } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, color: "#071739" }}>{userName}</Typography>
          <IconButton aria-label="بستن منو" onClick={() => setOpen(false)} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          {NAV_ITEMS.map((label) => {
            const active = label === ACTIVE;
            return (
              <ListItemButton
                key={label}
                selected={active}
                onClick={() => setOpen(false)}
                sx={{
                  py: 1.3,
                  borderInlineStart: active ? "3px solid #A68868" : "3px solid transparent",
                }}
              >
                <ListItemText
                  primary={label}
                  slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active ? 700 : 400, color: "#071739" } } }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}
