import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import tribeTheme from "./theme/tribeTheme.js";
import { ensureSeed } from "./mocks/seedData.js";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "./index.css";

const rtlCache = createCache({ key: "mui-rtl", stylisPlugins: [prefixer, rtlPlugin] });
ensureSeed();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={tribeTheme}>
        <CssBaseline />
        <MyRequestsPage />
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);
