import { Box } from '@mui/material';
import logoUrl from '../assets/tribe-logo-primary.svg';

export const NAVY = '#0B1B3B';

// Official Tribe logo (SVG file, used as-is)
export default function TribeLogo({ height = 52 }) {
  return (
    <Box
      component="img"
      src={logoUrl}
      alt="Tribe - Together, we learn better. We build better."
      sx={{ height: { xs: height * 0.75, md: height }, width: 'auto', display: 'block' }}
    />
  );
}
