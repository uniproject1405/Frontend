import { Box, LinearProgress, Typography } from '@mui/material';
import { fa } from '../utils/fa';

const NAVY = '#071739';

// Sidebar: how full the team is. The owner always takes the first place.
export default function TeamGlance({ capacity, accepted, hasRequests }) {
  const filled = Math.min(accepted, capacity);
  const available = Math.max(capacity - filled, 0);
  const isOpen = available > 0;
  const percent = capacity ? Math.round((filled / capacity) * 100) : 0;

  let hint = 'درخواست‌های جدید اینجا نمایش داده می‌شوند. هر معرفی‌نامه را بخوانید تا مناسب‌ترین هم‌تیمی را پیدا کنید.';
  if (hasRequests) {
    hint = isOpen
      ? 'پذیرفتن هر نفر او را به تیم اضافه می‌کند و یک جایگاه خالی را پر می‌کند.'
      : 'ظرفیت تیم تکمیل شده است. تا وقتی جایگاهی خالی نشود، نمی‌توانید درخواست دیگری را بپذیرید.';
  }

  return (
    <Box component="aside" sx={{ bgcolor: '#fff', border: '1px solid #E3E8EF', borderRadius: 3, p: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>نگاهی به تیم شما</Typography>

      <Typography variant="h5" fontWeight={800} color={NAVY} mt={1.5}>
        {fa(filled)} از {fa(capacity)} جایگاه پر شده
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {fa(accepted)} عضو پذیرفته‌شده
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label="درصد پرشدن ظرفیت تیم"
        sx={{ height: 6, borderRadius: 3, my: 2.5, bgcolor: '#CDD5DB', '& .MuiLinearProgress-bar': { bgcolor: NAVY } }}
      />

      <Typography fontWeight={700} color={NAVY}>
        {isOpen ? `${fa(available)} جایگاه خالی` : 'جایگاه خالی نداریم'}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1.5}>
        {isOpen ? 'جذب عضو باز است' : 'جذب عضو تکمیل شده است'}
      </Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.9} mt={1.5}>{hint}</Typography>
    </Box>
  );
}
