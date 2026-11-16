import { Avatar, Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { fa } from '../utils/fa';

// Small building blocks from the Explore card, reused by Explore, Home, Details and the dashboard
// so a project always looks the same wherever it appears.
const NAVY = '#071739';

export function StatusChip({ status, sx }) {
  const isOpen = status === 'open';
  return (
    <Chip
      size="small"
      variant="outlined"
      label={isOpen ? 'در حال جذب عضو' : 'جذب عضو تکمیل شده'}
      color={isOpen ? 'success' : 'default'}
      sx={{ flexShrink: 0, ...sx }}
    />
  );
}

export function SkillChips({ skills = [], max }) {
  const list = max ? skills.slice(0, max) : skills;
  if (!list.length) return null;
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {list.map(skill => (
        <Chip key={skill} label={skill} size="small" sx={{ bgcolor: '#F0F3F8', color: '#4B6382' }} />
      ))}
    </Stack>
  );
}

const initials = name => (name || '').split(' ').map(w => w[0]).join('').slice(0, 2);

export function CreatorRow({ creator }) {
  const { name = 'نامشخص', role = 'ایجادکننده‌ی پروژه' } = creator || {};
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#CDD5DB', color: NAVY }}>{initials(name)}</Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>{name}</Typography>
        <Typography variant="caption" color="text.secondary">{role}</Typography>
      </Box>
    </Stack>
  );
}

// "۳ نفر از ۵ ظرفیت · ۲ جایگاه خالی" + progress bar
export function CapacityMeter({ accepted, capacity, sx }) {
  const available = Math.max(capacity - accepted, 0);
  const percent = capacity ? Math.min(Math.round((accepted / capacity) * 100), 100) : 0;
  return (
    <Box sx={sx}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
        <Typography variant="body2">{fa(accepted)} نفر از {fa(capacity)} ظرفیت</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{fa(available)} جایگاه خالی</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ height: 6, borderRadius: 3, bgcolor: '#CDD5DB', '& .MuiLinearProgress-bar': { bgcolor: '#4B6382' } }}
      />
    </Box>
  );
}
