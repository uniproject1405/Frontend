
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";

import tribeTheme from "./theme/tribeTheme";
import App from "./App.jsx";
import { ensureSeed } from "./mocks/seedData";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
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
        <App />
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);
