import { Link } from 'react-router';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import TribeLogo from './TribeLogo';

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
  return (
    <Box component="header" sx={{ bgcolor: '#fff', borderBottom: '1px solid #E3E8EF' }}>
      <Container
        maxWidth="lg"
        sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        <Box component={Link} to="/explore" sx={{ textDecoration: 'none' }}>
          <TribeLogo height={100} />
        </Box>

        <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
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

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button sx={{ color: NAVY, fontWeight: 600, textTransform: 'none' }}>ورود</Button>
          <Button variant="contained" sx={{ bgcolor: NAVY, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } }}>
            عضویت در Tribe
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
