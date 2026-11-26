import { Link } from 'react-router';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import TribeLogo from './TribeLogo';
import { useAuth } from '../hooks/useAuth.js';
import { useLogout } from '../hooks/useLogout.js';

const NAVY = '#071739';

const NAV = [
  ['کاوش پروژه‌ها', '/explore'],
  ['یافتن افراد', '#'],
  ['تبادل مهارت', '#'],
  ['راهنمای استفاده', '#'],
];

// Internal routes use Link, placeholders use a plain anchor
const linkProps = to => (to.startsWith('/') ? { component: Link, to } : { component: 'a', href: to });

export default function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const logout = useLogout();

  return (
    <Box component="header" dir="rtl" sx={{ bgcolor: '#fff', borderBottom: '1px solid #E3E8EF' }}>
      <Container
        maxWidth="lg"
        sx={{ py: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        {/* Logo: first in DOM -> right side (RTL) */}
        <Box component={Link} to="/explore" sx={{ textDecoration: 'none' }}>
          <TribeLogo height={64} />
        </Box>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
          {NAV.map(([label, to]) => (
            <Typography
              key={label}
              {...linkProps(to)}
              sx={{ color: '#4B6382', textDecoration: 'none', fontSize: 15, '&:hover': { color: NAVY } }}
            >
              {label}
            </Typography>
          ))}
        </Stack>

        {/* Auth buttons: last in DOM -> left side, opposite the logo */}
        {isAuthenticated ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              sx={{ bgcolor: NAVY, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } }}
            >
              داشبورد
            </Button>
            <Button onClick={logout} sx={{ color: NAVY, fontWeight: 600, textTransform: 'none' }}>
              خروج
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button component={Link} to="/login" sx={{ color: NAVY, fontWeight: 600, textTransform: 'none' }}>
              ورود
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{ bgcolor: NAVY, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } }}
            >
              ثبت‌نام
            </Button>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
