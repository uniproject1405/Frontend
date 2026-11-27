import { useEffect } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const NAVY = '#071739';

// Dark confirmation banner. `toast` = { id, title, text } — a new id restarts the timer.
// insetInlineEnd keeps it on the far side of the reading direction (left in RTL).
export default function DecisionToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: 'fixed', top: 88, insetInlineEnd: { xs: 16, md: 32 }, insetInlineStart: { xs: 16, md: 'auto' },
        zIndex: 1300, maxWidth: { md: 420 }, bgcolor: NAVY, color: '#fff', borderRadius: 2, px: 2.5, py: 1.75,
        boxShadow: '0 12px 30px rgba(7,23,57,.25)',
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CheckIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{toast.title}</Typography>
          </Stack>
          <Typography sx={{ fontSize: 13, mt: 0.5, color: 'rgba(255,255,255,.75)' }}>{toast.text}</Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="بستن پیام"
          sx={{ color: NAVY, bgcolor: '#fff', borderRadius: 1, flexShrink: 0, '&:hover': { bgcolor: '#E3E8EF' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
