import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { cacheRtl, theme } from './styles/theme.js';
import { AuthProvider } from './context/AuthProvider.jsx';
import App from './App';

import './index.css';

// RTL cache + shared theme + auth state for the whole app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>
);
