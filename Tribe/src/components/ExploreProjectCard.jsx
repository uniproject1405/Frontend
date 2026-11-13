import { Link } from 'react-router';
import {
  Avatar, Box, Button, Card, CardActionArea, Chip, LinearProgress, Stack, Typography,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { fa } from '../utils/fa';

const NAVY = '#071739';

const TYPES = {
  development: { label: 'توسعه نرم‌افزار', Icon: CodeIcon },
  research: { label: 'پژوهش و علم', Icon: ScienceIcon },
  academic: { label: 'دانشگاهی', Icon: MenuBookIcon },
};

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2);

// Whole card is a link to the project details page
export default function ExploreProjectCard({ project }) {
  const { id, title, type, description, requiredSkills, capacity, accepted, openRoles, status, creator } = project;
  const available = Math.max(capacity - accepted, 0);
  const isOpen = status === 'open';
  const percent = capacity ? Math.round((accepted / capacity) * 100) : 0;
  const { label: typeLabel, Icon } = TYPES[type] || TYPES.development;

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} spacing={1}>
          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
            <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#CDD5DB', color: NAVY }}>
              {initials(creator.name)}
            </Avatar>
            <Box minWidth={0}>
              <Typography fontWeight={600} fontSize={14} noWrap>{creator.name}</Typography>
              <Typography variant="caption" color="text.secondary">{creator.role}</Typography>
            </Box>
          </Stack>
          <Chip
            size="small"
            variant="outlined"
            label={isOpen ? 'در حال جذب عضو' : 'جذب عضو تکمیل شده'}
            color={isOpen ? 'success' : 'default'}
            sx={{ flexShrink: 0 }}
          />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" mb={1}>
          <Icon fontSize="small" />
          <Typography variant="overline" letterSpacing={0} fontWeight={600}>{typeLabel}</Typography>
        </Stack>

        <Typography variant="h6" fontWeight={700} color={NAVY} lineHeight={1.5} mb={1}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          lineHeight={1.9}
          mb={2}
          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={2}>
          {requiredSkills.map(skill => (
            <Chip key={skill} label={skill} size="small" sx={{ bgcolor: '#F0F3F8', color: '#4B6382' }} />
          ))}
        </Stack>

        <Box mt="auto">
          <Stack direction="row" justifyContent="space-between" mb={0.75}>
            <Typography variant="body2">{fa(accepted)} نفر از {fa(capacity)} ظرفیت</Typography>
            <Typography variant="body2" fontWeight={700}>{fa(available)} جایگاه خالی</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 6, borderRadius: 3, mb: 1.5, bgcolor: '#CDD5DB', '& .MuiLinearProgress-bar': { bgcolor: '#4B6382' } }}
          />
          <Typography variant="body2" color="text.secondary" mb={2}>
            {available && openRoles.length ? openRoles.join('، ') : 'تیم تکمیل است؛ جایگاه خالی وجود ندارد'}
          </Typography>
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
