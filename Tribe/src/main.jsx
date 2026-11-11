
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";

import tribeTheme from "./theme/tribeTheme";
import App from "./App.jsx";
import "@fontsource-variable/inter";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={tribeTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
