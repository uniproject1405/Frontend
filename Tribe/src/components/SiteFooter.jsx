import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import TribeLogo from './TribeLogo';
import SiteLink from './SiteLink';

const NAVY = '#071739';

// [label, route]. No route yet → rendered as a disabled "به‌زودی" link.
const COLUMNS = [
  ['کاوش', [['کاوش پروژه‌ها', '/explore'], ['یافتن افراد'], ['تبادل مهارت']]],
  ['جامعه', [['راهنمای استفاده'], ['داستان ما'], ['قوانین و راهنما', '/terms']]],
  ['پشتیبانی', [['مرکز راهنما'], ['ارتباط با ما'], ['ارسال بازخورد']]],
];

export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #E3E8EF', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 4 }}>
          <Box>
            <TribeLogo height={100} />
            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 260, lineHeight: 1.9 }}>
              خانه‌ای برای کسانی که می‌سازند، یاد می‌گیرند و ایده‌ها را به واقعیت تبدیل می‌کنند.
            </Typography>
          </Box>

          {COLUMNS.map(([title, links]) => (
            <Box key={title}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: NAVY, mb: 1.5 }}>{title}</Typography>
              <Stack spacing={1}>
                {links.map(([label, to]) => <SiteLink key={label} label={label} to={to} />)}
              </Stack>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">© ۲۰۲۶ Tribe. بهتر، با هم.</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <SiteLink label="حریم خصوصی" />
            <Typography variant="body2" color="text.secondary">·</Typography>
            <SiteLink label="قوانین استفاده" to="/terms" />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
