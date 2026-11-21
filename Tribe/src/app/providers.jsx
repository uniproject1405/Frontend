import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import tribeTheme from "../theme/tribeTheme";
import { AuthProvider } from "../context/AuthProvider.jsx";

// RTL: MUI styles are flipped by stylis-plugin-rtl; theme.direction handles the rest.
const rtlCache = createCache({ key: "mui-rtl", stylisPlugins: [prefixer, rtlPlugin] });

// The one set of providers for the whole app: RTL cache + the one theme + login state.
export default function Providers({ children }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={tribeTheme}>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
