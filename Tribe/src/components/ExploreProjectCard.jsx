import { Link } from 'react-router';
import { Box, Button, Card, CardActionArea, Stack, Typography } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { CapacityMeter, CreatorRow, SkillChips, StatusChip } from './projectParts';

const NAVY = '#071739';

const TYPES = {
  development: { label: 'توسعه نرم‌افزار', Icon: CodeIcon },
  research: { label: 'پژوهش و علم', Icon: ScienceIcon },
  academic: { label: 'دانشگاهی', Icon: MenuBookIcon },
};

// Whole card is a link to the project details page
export default function ExploreProjectCard({ project }) {
  const { id, title, type, description = '', requiredSkills = [], capacity = 0, accepted = 0, openRoles = [], status, creator } = project;
  const available = Math.max(capacity - accepted, 0);
  const typeInfo = TYPES[type];

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', borderRadius: 3, transition: 'box-shadow .2s', '&:hover': { boxShadow: '0 12px 30px rgba(7,23,57,.12)' } }}
    >
      <CardActionArea
        component={Link}
        to={`/projects/${id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', p: 2.5 }}
      >
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <CreatorRow creator={creator} />
          <StatusChip status={status} full={available === 0} />
        </Stack>

        {/* Only a project that states its type shows it; no guessed default. */}
        {typeInfo && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary', mb: 1 }}>
            <typeInfo.Icon fontSize="small" />
            <Typography variant="overline" sx={{ letterSpacing: 0, fontWeight: 600 }}>{typeInfo.label}</Typography>
          </Stack>
        )}

        <Typography variant="h6" sx={{ fontWeight: 700, color: NAVY, lineHeight: 1.5, mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.9, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {description}
        </Typography>

        <SkillChips skills={requiredSkills} />

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <CapacityMeter accepted={accepted} capacity={capacity} sx={{ mb: 2 }} />
          {/* The meter already shows free seats; only add the open roles when there are any. */}
          {available > 0 && openRoles.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {openRoles.join('، ')}
            </Typography>
          )}
          {/* span, not button: the whole card is already the link */}
          <Button
            component="span"
            fullWidth
            variant="outlined"
            sx={{ color: NAVY, borderColor: NAVY, textTransform: 'none', fontSize: 15 }}
          >
            مشاهده جزئیات
          </Button>
        </Box>
      </CardActionArea>
    </Card>
  );
}
