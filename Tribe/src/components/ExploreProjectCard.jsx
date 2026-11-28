import { Link } from 'react-router';
import {
  Avatar, Box, Button, Card, CardActionArea, Chip, LinearProgress, Stack, Typography,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { fa } from '../utils/fa';
import { skillLabel } from '../utils/skillLabel';

const NAVY = '#071739';

const TYPES = {
  startup: { label: 'استارتاپ', Icon: CodeIcon },
  development: { label: 'توسعه نرم‌افزار', Icon: CodeIcon },
  learning: { label: 'یادگیری', Icon: MenuBookIcon },
  research: { label: 'پژوهش و علم', Icon: ScienceIcon },
  academic: { label: 'دانشگاهی', Icon: MenuBookIcon },
  personal: { label: 'پروژه شخصی', Icon: CodeIcon },
};

const initials = name => (name || 'عضو').split(' ').map(w => w[0]).join('').slice(0, 2);

// Whole card is a link to the project details page
export default function ExploreProjectCard({ project }) {
  const {
    id, title, type, description, requiredSkills = [], capacity = 0,
    accepted = 0, remaining, openRoles = [], status, creator,
  } = project;
  const available = remaining == null
    ? Math.max(capacity - accepted, 0)
    : Math.max(Number(remaining) || 0, 0);
  const isOpen = status === 'open';
  const percent = capacity ? Math.round((accepted / capacity) * 100) : 0;
  const typeInfo = TYPES[type];

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', borderRadius: '12px', transition: 'box-shadow .2s', '&:hover': { boxShadow: '0 12px 30px rgba(7,23,57,.12)' } }}
    >
      <CardActionArea
        component={Link}
        to={`/projects/${id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', p: 2.5 }}
      >
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Avatar
              src={creator?.avatar || undefined}
              alt={creator?.name || 'عضو Tribe'}
              sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#CDD5DB', color: NAVY }}
            >
              {initials(creator?.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>
                {creator?.name || 'عضو Tribe'}
              </Typography>

              {creator?.username && (
                <Typography
                  variant="caption"
                  dir="ltr"
                  sx={{ color: 'text.secondary', textAlign: 'left', display: 'block' }}
                >
                  @{creator?.username}
                </Typography>
              )}
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

        {(typeInfo || project.customType) && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary', mb: 1 }}>
            {typeInfo?.Icon && <typeInfo.Icon fontSize="small" />}
            <Typography variant="overline" sx={{ letterSpacing: 0, fontWeight: 600 }}>{type === 'other' ? (project.customType || 'سایر') : (typeInfo?.label || project.customType)}</Typography>
          </Stack>
        )}

        <Typography variant="h6" sx={{ fontWeight: 700, color: NAVY, lineHeight: 1.5, mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2 }}>
          {requiredSkills.map((skill, index) => (
            <Chip key={skill.id ?? skill.name ?? index} label={skillLabel(skill)} size="small" sx={{ bgcolor: '#F0F3F8', color: '#4B6382' }} />
          ))}
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="body2">{fa(accepted)} نفر از {fa(capacity)} ظرفیت</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{fa(available)} جایگاه خالی</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 6, borderRadius: 3, mb: 1.5, bgcolor: '#CDD5DB', '& .MuiLinearProgress-bar': { bgcolor: '#4B6382' } }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {!available ? 'تیم تکمیل است؛ جایگاه خالی وجود ندارد' : openRoles.length ? openRoles.join('، ') : 'جایگاه خالی وجود دارد'}
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
