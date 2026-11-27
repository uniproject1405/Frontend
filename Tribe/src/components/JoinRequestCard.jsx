import { Box, Button, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { timeAgo } from '../utils/timeAgo';

const NAVY = '#071739';

// One applicant. Pending → reject/accept buttons; decided → the outcome label.
export default function JoinRequestCard({ request, busy, canAccept, onDecide }) {
  const { name, role, appliedAt, skills, message, status } = request;

  return (
    <Box component="article" sx={{ bgcolor: '#fff', border: '1px solid #E3E8EF', borderRadius: 3, p: 3 }}>
      <Typography variant="h6" color={NAVY} sx={{ fontWeight: 700, lineHeight: 1.5 }}>{name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {role} · {timeAgo(appliedAt)} درخواست داد
      </Typography>

      {skills.length > 0 && (
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mt: 1.75 }}>
          {skills.map(s => (
            <Box key={s} component="span" sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: 13, bgcolor: '#F0F3F8', color: '#4B6382' }}>
              {s}
            </Box>
          ))}
        </Stack>
      )}

      <Typography color="text.secondary" sx={{ lineHeight: 2, mt: 2, whiteSpace: 'pre-line' }}>{message}</Typography>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "flex-end", mt: 2.5, minHeight: 40 }}>
        {status === 'pending' ? (
          <>
            {!canAccept && (
              <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                ظرفیت تیم تکمیل شده است.
              </Typography>
            )}
            <Button
              variant="outlined"
              disabled={busy}
              onClick={() => onDecide(request, 'rejected')}
              sx={{ color: NAVY, borderColor: '#CDD5DB', px: 2.5, '&:hover': { borderColor: NAVY, bgcolor: '#F4F6F8' } }}
            >
              رد کردن
            </Button>
            <Button
              variant="contained"
              disabled={busy || !canAccept}
              onClick={() => onDecide(request, 'accepted')}
              sx={{ bgcolor: NAVY, px: 2.5, '&:hover': { bgcolor: '#0E2452' } }}
            >
              {busy ? 'در حال ثبت...' : 'پذیرفتن'}
            </Button>
          </>
        ) : (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: NAVY, fontWeight: 700, fontSize: 14 }}>
            {status === 'accepted' && <CheckIcon sx={{ fontSize: 18 }} />}
            <span>{status === 'accepted' ? 'پذیرفته شد' : 'رد شد'}</span>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
