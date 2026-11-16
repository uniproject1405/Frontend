import { useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Alert, Avatar, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, TextField, Typography,
} from "@mui/material";

import { getProfile, saveProfile } from "../services/currentUser";
import { useMyStats } from "../services/membershipService";
import { resetMockData } from "../services/mockProjectService";
import { fa } from "../utils/fa";
import { useStoredJson } from "../services/store";
import { PROFILE_KEY } from "../services/currentUser";

const EMPTY = {};

function Stat({ label, value, to }) {
  return (
    <Card
      variant="outlined"
      component={RouterLink}
      to={to}
      sx={{ p: 2, textDecoration: "none", color: "inherit", transition: "transform .15s", "&:hover": { transform: "translateY(-2px)" }, "&:focus-visible": { outline: "2px solid #071739" } }}
    >
      <Typography variant="h4" component="p" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fa(value)}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Card>
  );
}

function EditDialog({ open, onClose }) {
  const [form, setForm] = useState(() => {
    const p = getProfile();
    return { ...p, skillsText: p.skills.join(", ") };
  });
  const nameError = form.name.trim().length === 0;
  function save() {
    if (nameError) return;
    saveProfile({ ...form, skills: form.skillsText.split(",") });
    onClose();
  }
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ویرایش پروفایل</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="نام" value={form.name} onChange={set("name")} error={nameError} helperText={nameError ? "نام الزامی است" : `${form.name.length}/40`} slotProps={{ htmlInput: { maxLength: 40 } }} />
          <TextField label="عنوان شغلی" value={form.headline} onChange={set("headline")} helperText="مثلاً: طراح محصول" slotProps={{ htmlInput: { maxLength: 60 } }} />
          <TextField label="درباره شما" multiline minRows={3} value={form.bio} onChange={set("bio")} helperText={`${form.bio.length}/300`} slotProps={{ htmlInput: { maxLength: 300 } }} />
          <TextField label="مهارت‌ها" value={form.skillsText} onChange={set("skillsText")} helperText="با ویرگول جدا کنید" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>انصراف</Button>
        <Button variant="contained" onClick={save} disabled={nameError}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}

function Profile() {
  useStoredJson(PROFILE_KEY, EMPTY); // re-render after saving
  const profile = getProfile();
  const stats = useMyStats();
  const [editing, setEditing] = useState(false);
  const [done, setDone] = useState("");

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 380px) minmax(0, 1fr)" }, alignItems: "start" }}>
        <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "#E3C39D", color: "#071739", fontSize: 24 }}>{profile.name[0]}</Avatar>
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: "#071739", wordBreak: "break-word" }}>{profile.name}</Typography>
              {profile.headline && <Typography color="text.secondary">{profile.headline}</Typography>}
            </Box>
            {profile.bio && <Typography sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{profile.bio}</Typography>}
            <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
              {profile.skills.map((s) => <Chip key={s} label={s} sx={{ bgcolor: "#F0F3F8", color: "#4B6382" }} />)}
              {profile.skills.length === 0 && <Typography variant="body2" color="text.secondary">مهارت‌هایتان را اضافه کنید تا مالکان پروژه بدانند چه کمکی از شما برمی‌آید.</Typography>}
            </Stack>
            <Button variant="outlined" onClick={() => setEditing(true)}>ویرایش پروفایل</Button>
          </Stack>
          {editing && <EditDialog open onClose={() => setEditing(false)} />}
        </Card>

        <Stack spacing={3}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" } }}>
            <Stat label="پروژه‌هایی که ساخته‌اید" value={stats.created} to="/my-projects" />
            <Stat label="تیم‌هایی که عضو شده‌اید" value={stats.joined} to="/my-projects?tab=joined" />
            <Stat label="در انتظار پاسخ" value={stats.waiting} to="/my-projects?tab=requests" />
            <Stat label="درخواست‌های در انتظار بررسی" value={stats.toReview} to="/my-projects?tab=review" />
          </Box>

          <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1.5 }}>نیازمند توجه شما</Typography>
            {stats.byProject.length === 0 ? (
              <Typography color="text.secondary">فعلاً چیزی برای بررسی نیست.</Typography>
            ) : (
              <Stack spacing={1}>
                {stats.byProject.map(({ project, count }) => (
                  <Stack key={project.id} direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    <Typography sx={{ minWidth: 0, wordBreak: "break-word" }}>{project.title}</Typography>
                    <Button component={RouterLink} to={`/my-projects/${project.id}/requests`} sx={{ flexShrink: 0 }}>
                      بررسی {fa(count)} درخواست
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>

          <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>داده‌های آزمایشی</Typography>
            <Button color="inherit" variant="outlined" onClick={async () => { await resetMockData(); setDone("داده‌های آزمایشی بازگردانی شد."); }}>بازنشانی داده‌های آزمایشی</Button>
            {done && <Alert severity="success" sx={{ mt: 2 }} onClose={() => setDone("")}>{done}</Alert>}
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

export default Profile;
