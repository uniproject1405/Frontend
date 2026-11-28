import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  Alert, Box, Button, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreProjectCard from '../components/ExploreProjectCard';
import { getExploreProjects } from '../services/exploreService';
import { fa } from '../utils/fa';

const NAVY = '#071739';
const STATUS_OPTIONS = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'open', label: 'در حال جذب عضو' },
  { value: 'closed', label: 'جذب عضو بسته' },
];

// Filters live in the URL (?search=&skill=&status=) so the back button and shared links work.
export default function ExploreProjects() {
  const [params, setParams] = useSearchParams();
  const filters = {
    search: params.get('search') || '',
    skill: params.get('skill') || '',
    status: params.get('status') || '',
  };
  const [input, setInput] = useState(filters.search);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const setFilter = patch => {
    const next = { ...filters, ...patch };
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)), { replace: true });
  };

  // Skill dropdown options, loaded once
  useEffect(() => {
    getExploreProjects()
      .then(all => setSkills([...new Set(all.flatMap(p => p.requiredSkills || []))].sort()))
      .catch(() => setSkills([]));
  }, []);

  // Reload whenever a filter changes
  const { search, skill, status } = filters;
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError('');
    getExploreProjects({ search, skill, status })
      .then(data => { if (active) setProjects(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, skill, status]);

  const onSearch = e => {
    e.preventDefault();
    setFilter({ search: input.trim() });
  };

  const clearFilters = () => {
    setInput('');
    setParams({}, { replace: true });
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" color={NAVY} sx={{ fontWeight: 800 }}>کاوش پروژه‌ها</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          هدفی مشترک پیدا کنید، مهارت‌هایتان را به اشتراک بگذارید و چیزی ارزشمند بسازید.
        </Typography>
      </Box>

      <Box component="form" onSubmit={onSearch} sx={{ bgcolor: '#fff', border: '1px solid #E3E8EF', borderRadius: 3, p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="جست‌وجوی عنوان پروژه"
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
            جست‌وجو
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, mt: 2 }}>
          <TextField
            select
            size="small"
            label="مهارت‌های موردنیاز"
            sx={{ flex: 1, minWidth: 0 }}
            value={filters.skill}
            onChange={e => setFilter({ skill: e.target.value })}
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
            onChange={e => setFilter({ status: e.target.value })}
          >
            {STATUS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
          <Button variant="text" onClick={clearFilters} sx={{ whiteSpace: 'nowrap', color: NAVY, flexShrink: 0 }}>
            پاک کردن فیلترها
          </Button>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2, minHeight: 24 }}>
        {!loading && !error && (
          <Typography color="text.secondary">{fa(projects.length)} پروژه برای کشف</Typography>
        )}
        {loading && <Typography color="text.secondary">در حال بارگذاری پروژه‌ها...</Typography>}
      </Box>

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

      {!loading && !error && projects.length > 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
          همه پروژه‌ها را مشاهده کردید. همکاری بزرگ بعدی شما از همین‌جا شروع می‌شود.
        </Typography>
      )}
    </>
  );
}
