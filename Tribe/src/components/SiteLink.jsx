import { Link } from 'react-router';
import { Box, Typography } from '@mui/material';

// A header/footer link. No `to` yet → shown disabled with a small "به‌زودی" (coming soon) label,
// so nothing in the UI is a dead click.
export default function SiteLink({ label, to, sx, variant }) {
  const base = { color: '#4B6382', textDecoration: 'none', fontSize: 14, ...sx };
  if (to) {
    return (
      <Typography component={Link} to={to} variant={variant} sx={{ ...base, '&:hover': { color: '#071739' } }}>
        {label}
      </Typography>
    );
  }
  return (
    <Typography component="span" variant={variant} aria-disabled="true" sx={{ ...base, opacity: 0.6, cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      {label}
      <Box component="span" sx={{ fontSize: 10, px: 0.75, py: 0.1, borderRadius: 1, bgcolor: '#F0F3F8', color: '#4B6382' }}>به‌زودی</Box>
    </Typography>
  );
}
