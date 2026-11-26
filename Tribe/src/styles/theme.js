import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

/*
  تم و تنظیمات راست‌چین مشترک همه صفحه‌ها.
  رنگ‌ها طبق سند هویت بصری Tribe هستند.
*/

// راست‌چین کردن Material UI
export const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export const theme = createTheme({
  direction: "rtl",

  palette: {
    primary: {
      main: "#0b1b3d",
      dark: "#17295a",
    },
    background: {
      default: "#f4f6fa",
    },
  },

  typography: {
    fontFamily: "'Vazirmatn', sans-serif",
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiTextField: {
      defaultProps: { fullWidth: true },
    },
  },
});