import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';

// RTL support for MUI: a cache that flips styles to right-to-left
const rtlCache = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });

const theme = createTheme({
  direction: 'rtl',
  typography: { fontFamily: 'Vazirmatn, Tahoma, sans-serif' },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);
