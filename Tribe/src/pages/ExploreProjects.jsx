import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Container, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExploreProjectCard from '../components/ExploreProjectCard';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { getExploreProjects } from '../services/exploreService';
import { fa } from '../utils/fa';

const NAVY = '#071739';
const EMPTY_FILTERS = { search: '', skill: '', status: '' };
const STATUS_OPTIONS = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'open', label: 'در حال جذب عضو' },
  { value: 'closed', label: 'جذب عضو تکمیل شده' },
];

export default function ExploreProjects() {
  const [input, setInput] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Skill dropdown options, loaded once
  useEffect(() => {
    getExploreProjects()
      .then(all => setSkills([...new Set(all.flatMap(p => p.requiredSkills))].sort()))
      .catch(() => setSkills([]));
  }, []);

  // Reload whenever a filter changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getExploreProjects(filters)
      .then(data => { if (active) setProjects(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters]);

  const onSearch = e => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: input.trim() }));
  };

  const clearFilters = () => {
    setInput('');
    setFilters(EMPTY_FILTERS);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} color={NAVY}>کاوش پروژه‌ها</Typography>
            <Typography color="text.secondary" mt={0.5}>
              هدفی مشترک پیدا کنید، مهارت‌هایتان را به اشتراک بگذارید و چیزی ارزشمند بسازید.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: NAVY, px: 2.5, flexShrink: 0, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } }}
          >
            ایجاد پروژه
          </Button>
        </Stack>

        <Box component="form" onSubmit={onSearch} sx={{ bgcolor: '#fff', border: '1px solid #E3E8EF', borderRadius: 3, p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="جستجوی عنوان پروژه"
              value={input}
              onChange={e => setInput(e.target.value)}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#E3C39D', color: NAVY, '&:hover': { bgcolor: '#D6B088' }, minWidth: 120, flexShrink: 0 }}
            >
              جستجو
            </Button>
            <Typography color="text.secondary" fontSize={14} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', lg: 'block' } }}>
              فصل بعدی مسیرت را پیدا کن.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} mt={2}>
            <TextField
              select
              size="small"
              label="مهارت‌های موردنیاز"
              sx={{ flex: 1, minWidth: 0 }}
              value={filters.skill}
              onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
            >
              <MenuItem value="">همه مهارت‌ها</MenuItem>
              {skills.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField
              select
              size="small"
              label="وضعیت جذب عضو"
              sx={{ flex: 1, minWidth: 0 }}
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            <Button variant="text" onClick={clearFilters} sx={{ whiteSpace: 'nowrap', color: NAVY, flexShrink: 0 }}>
              پاک کردن فیلترها
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          {!loading && !error && (
            <Typography color="text.secondary">{fa(projects.length)} پروژه برای کشف</Typography>
          )}
          {loading && <Typography color="text.secondary">در حال بارگذاری پروژه‌ها...</Typography>}
          <Typography color="text.secondary" fontSize={14}>مرتب‌سازی: پیشنهادی</Typography>
        </Stack>

        {!loading && !error && projects.length === 0 && (
          <Alert severity="info">پروژه‌ای با این فیلترها پیدا نشد.</Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {projects.map(project => <ExploreProjectCard key={project.id} project={project} />)}
        </Box>
      </Container>

      <Box sx={{ bgcolor: '#EEF1F4', mt: 6, py: 4 }}>
        <Container maxWidth="lg">
          <Typography color="text.secondary" textAlign="center">
            همه پروژه‌ها را مشاهده کردید. همکاری بزرگ بعدی شما از همین‌جا شروع می‌شود.
          </Typography>
        </Container>
      </Box>

      <SiteFooter />
    </Box>
  );
}
