import { useRef, useState } from 'react';
import {
  Alert, Autocomplete, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, Stack, Switch, TextField, Typography,
} from '@mui/material';
import { isTelegram, isUrl } from '../utils/links';
import { fa } from '../utils/fa';

const NAVY = '#071739';
const MAX_AVATAR_MB = 2;

const initials = (name = '') => name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2);

const toForm = p => ({
  ...p,
  username: p.username || '',
  links: { ...p.links },
  openToCollab: { ...p.openToCollab },
  availableToHelp: { ...p.availableToHelp },
  helpTopics: p.helpTopics.join('\n'),
});

// Latin text (URLs / usernames) inside an RTL form
const ltrInput = { htmlInput: { dir: 'ltr', style: { textAlign: 'left' } } };

export default function ProfileEditDialog({ open, profile, onClose, onSave }) {
  const [form, setForm] = useState(() => toForm(profile));
  const [errors, setErrors] = useState({});
  const [avatarError, setAvatarError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileRef = useRef(null);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setIn = (group, key, value) => setForm(f => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const onPickAvatar = e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setAvatarError('فقط فایل تصویری انتخاب کنید.');
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) return setAvatarError(`حجم تصویر باید کمتر از ${MAX_AVATAR_MB} مگابایت باشد.`);
    setAvatarError('');
    set('avatarUrl', URL.createObjectURL(file));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'نام را وارد کنید.';
    if (!isUrl(form.links.github.trim())) next.github = 'آدرس معتبر نیست (با https:// شروع شود).';
    if (!isUrl(form.links.linkedin.trim())) next.linkedin = 'آدرس معتبر نیست (با https:// شروع شود).';
    if (!isTelegram(form.links.telegram.trim())) next.telegram = 'نام کاربری (مثل @name) یا لینک t.me وارد کنید.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSaveError('');
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        headline: form.headline.trim(),
        summary: form.summary.trim(),
        about: form.about.trim(),
        links: Object.fromEntries(Object.entries(form.links).map(([k, v]) => [k, v.trim()])),
        openToCollab: { ...form.openToCollab, note: form.openToCollab.note.trim() },
        availableToHelp: { ...form.availableToHelp, note: form.availableToHelp.note.trim() },
        helpTopics: form.helpTopics.split('\n').map(s => s.trim()).filter(Boolean),
      });
    } catch (err) {
      setSaveError(err.message || 'ذخیره‌ی تغییرات با خطا مواجه شد.');
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" scroll="paper">
      <Box component="form" onSubmit={submit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DialogTitle sx={{ fontWeight: 800, color: NAVY }}>ویرایش پروفایل</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} pt={0.5}>
            {/* Avatar */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={form.avatarUrl || undefined} sx={{ width: 72, height: 72, fontSize: 24, bgcolor: '#CDD5DB', color: NAVY }}>
                {initials(form.name)}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined" onClick={() => fileRef.current?.click()} sx={{ color: NAVY, borderColor: NAVY }}>
                    تغییر تصویر
                  </Button>
                  {form.avatarUrl && (
                    <Button size="small" color="inherit" onClick={() => set('avatarUrl', '')}>حذف تصویر</Button>
                  )}
                </Stack>
                <Typography variant="caption" color={avatarError ? 'error' : 'text.secondary'} display="block" mt={0.5}>
                  {avatarError || `فرمت تصویر، حداکثر ${MAX_AVATAR_MB} مگابایت`}
                </Typography>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
              </Box>
            </Stack>

            <TextField
              label="نام و نام خانوادگی" required value={form.name} error={!!errors.name} helperText={errors.name}
              onChange={e => set('name', e.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }}
            />
            <TextField
              label="نام کاربری"
              value={form.username}
              onChange={e => set('username', e.target.value)}
              placeholder="مثلاً: niusha_dev"
              helperText="نام کاربری شما در Tribe (حداکثر ۲۰ کاراکتر)"
              slotProps={{
                htmlInput: {
                  dir: 'ltr',
                  style: { textAlign: 'left' },
                  maxLength: 20,
                },
              }}
            />
            <TextField
              label="عنوان کوتاه" value={form.headline} onChange={e => set('headline', e.target.value)}
              helperText="مثلاً: توسعه‌دهنده‌ی فول‌استک · در حال ساخت وبی دسترس‌پذیرتر"
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              label="جمله‌ی معرفی" multiline minRows={2} value={form.summary} onChange={e => set('summary', e.target.value)}
              helperText={`${fa(form.summary.length)} از ۱۶۰ نویسه`} slotProps={{ htmlInput: { maxLength: 160 } }}
            />
            <TextField
              label="کمی درباره‌ی من" multiline minRows={5} value={form.about} onChange={e => set('about', e.target.value)}
              helperText={`${fa(form.about.length)} از ۶۰۰ نویسه`} slotProps={{ htmlInput: { maxLength: 600 } }}
            />

            <Autocomplete
              multiple freeSolo autoSelect options={[]} value={form.skills}
              onChange={(_, value) => set('skills', [...new Set(value.map(v => v.trim()).filter(Boolean))].slice(0, 15))}
              renderValue={(value, getItemProps) => value.map((option, index) => {
                const { key, ...itemProps } = getItemProps({ index });
                return <Chip key={key} label={option} size="small" {...itemProps} />;
              })}
              renderInput={params => (
                <TextField {...params} label="مهارت‌ها و علایق" helperText="بعد از نوشتن هر مورد Enter بزنید (حداکثر ۱۵ مورد)" />
              )}
            />

            {/* Optional links */}
            <Box>
              <Typography fontWeight={700} color={NAVY} mb={1.5}>لینک‌ها (اختیاری)</Typography>
              <Stack spacing={2}>
                <TextField
                  label="گیت‌هاب" placeholder="https://github.com/username" value={form.links.github}
                  onChange={e => setIn('links', 'github', e.target.value)} error={!!errors.github} helperText={errors.github}
                  slotProps={ltrInput}
                />
                <TextField
                  label="لینکدین" placeholder="https://linkedin.com/in/username" value={form.links.linkedin}
                  onChange={e => setIn('links', 'linkedin', e.target.value)} error={!!errors.linkedin} helperText={errors.linkedin}
                  slotProps={ltrInput}
                />
                <TextField
                  label="ایمیل"
                  placeholder="example@gmail.com"
                  value={form.links.email}
                  onChange={e => setIn('links', 'email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  slotProps={ltrInput}
                />
              </Stack>
            </Box>

            {/* Collaboration status */}
            <Box>
              <Typography fontWeight={700} color={NAVY} mb={1}>وضعیت همکاری</Typography>
              <FormControlLabel
                control={<Switch checked={form.openToCollab.enabled} onChange={e => setIn('openToCollab', 'enabled', e.target.checked)} />}
                label="آماده‌ی همکاری هستم"
              />
              <TextField
                fullWidth size="small" multiline minRows={2} label="توضیح (زمان، نوع همکاری، علاقه‌ها)"
                disabled={!form.openToCollab.enabled} value={form.openToCollab.note}
                onChange={e => setIn('openToCollab', 'note', e.target.value)} slotProps={{ htmlInput: { maxLength: 200 } }}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={<Switch checked={form.availableToHelp.enabled} onChange={e => setIn('availableToHelp', 'enabled', e.target.checked)} />}
                label="آماده‌ی کمک به دیگران هستم"
              />
              <TextField
                fullWidth size="small" multiline minRows={2} label="توضیح (در چه زمینه‌ای کمک می‌کنید)"
                disabled={!form.availableToHelp.enabled} value={form.availableToHelp.note}
                onChange={e => setIn('availableToHelp', 'note', e.target.value)} slotProps={{ htmlInput: { maxLength: 200 } }}
              />
            </Box>

            <TextField
              label="می‌توانم در این موارد کمک کنم" multiline minRows={3} value={form.helpTopics}
              onChange={e => set('helpTopics', e.target.value)} helperText="هر مورد را در یک خط جدید بنویسید"
            />

            {saveError && <Alert severity="error">{saveError}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: NAVY, px: 3, '&:hover': { bgcolor: '#0E2452' } }}>
            {saving ? 'در حال ذخیره...' : 'ذخیره‌ی تغییرات'}
          </Button>
          <Button onClick={onClose} disabled={saving} sx={{ color: NAVY }}>انصراف</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
