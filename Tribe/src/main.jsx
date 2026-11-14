import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { cacheRtl, theme } from "./theme/index.js";
import { AuthProvider } from "./features/auth/AuthProvider.jsx";
import App from "./App.jsx";

import "./styles/tokens.css";
import "./styles/motion.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </CacheProvider>
    </BrowserRouter>
  </StrictMode>
);
