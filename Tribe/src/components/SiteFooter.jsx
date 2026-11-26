import { Link } from 'react-router';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import TribeLogo from './TribeLogo';

const NAVY = '#071739';

const COLUMNS = [
  ['کاوش', ['کاوش پروژه‌ها', 'یافتن افراد', 'تبادل مهارت']],
  ['جامعه', ['راهنمای استفاده', 'داستان ما', 'قوانین و راهنما']],
  ['پشتیبانی', ['مرکز راهنما', 'ارتباط با ما', 'ارسال بازخورد']],
];

const linkSx = { color: '#4B6382', textDecoration: 'none', fontSize: 14, '&:hover': { color: NAVY } };

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #E3E8EF', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 4 }}>
          <Box>
            <TribeLogo height={100} />
            <Typography sx={{ color: 'text.secondary', mt: 2, maxWidth: 260, lineHeight: 1.9 }}>
              خانه‌ای برای کسانی که می‌سازند، یاد می‌گیرند و ایده‌ها را به واقعیت تبدیل می‌کنند.
            </Typography>
          </Box>

          {COLUMNS.map(([title, links]) => (
            <Box key={title}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: NAVY, mb: 1.5 }}>{title}</Typography>
              <Stack spacing={1}>
                {links.map(label => (
                  <Typography key={label} component="a" href="#" sx={linkSx}>{label}</Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>© ۲۰۲۶ Tribe. بهتر، با هم.</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography component="a" href="#" variant="body2" sx={linkSx}>حریم خصوصی</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>·</Typography>
            <Typography component={Link} to="/terms" variant="body2" sx={linkSx}>قوانین استفاده</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
