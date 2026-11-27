
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import ExploreProjectCard from '../components/ExploreProjectCard';
import ProfileEditDialog from '../components/ProfileEditDialog';

import currentUser, {
  getProfile,
  saveProfile,
} from '../services/currentUser';

import {
  getJoinedProjects,
  getOwner,
  readRequests,
} from '../services/membershipService';

import { getMyProjects } from '../services/mockProjectService';
import { fa } from '../utils/fa';

const NAVY = '#071739';
const BEIGE = '#E3C39D';

const initials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2);

const cardSx = {
  bgcolor: '#fff',
  border: '1px solid #E3E8EF',
  borderRadius: 3,
  p: 3,
};

const OutArrow = props => (
  <ArrowOutwardIcon
    {...props}
    sx={{ transform: 'scaleX(-1)', ...props.sx }}
  />
);

function Section({ title, children }) {
  return (
    <Box sx={cardSx}>
      <Typography variant="h6" fontWeight={800} color={NAVY} mb={2}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function StatusBadge({ children, color }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.75,
        py: 0.75,
        borderRadius: 1.5,
        fontSize: 13,
        color: NAVY,
        bgcolor: color,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: NAVY,
        }}
      />
      {children}
    </Box>
  );
}

const BADGE_COLLAB = '#E3E8F0';
const BADGE_HELP = '#F1E6D8';

function ProjectsSection({ title, projects }) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}
      >
        <Typography variant="h5" color={NAVY} sx={{ fontWeight: 800 }}>
          {title}
        </Typography>

        <Typography color="text.secondary" sx={{ fontSize: 14, flexShrink: 0 }}>
          {fa(projects.length)} پروژه
        </Typography>
      </Stack>

      {projects.length === 0 ? (
        <Box sx={{ ...cardSx, py: 2.5 }}>
          <Typography color="text.secondary">
            هنوز پروژه‌ای در این بخش نیست.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {projects.map(project => (
            <ExploreProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

// Adapt Tribe project data to the props expected by ExploreProjectCard.
function prepareProject(project, owner, accepted = 0) {
  return {
    ...project,
    type: project.type || 'development',
    accepted,
    openRoles: project.openRoles || [],
    creator: {
      name: owner?.name || 'نامشخص',
      role: owner?.headline || '',
    },
  };
}

export default function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = getProfile();

        const [allProjects, joinedResults] = await Promise.all([
          getMyProjects(),
          getJoinedProjects(),
        ]);

        const requests = readRequests();

        const createdProjects = allProjects
          .filter(project => getOwner(project.id).id === currentUser.id)
          .map(project => {
            const owner = getOwner(project.id);

            const accepted = requests.filter(
              request =>
                String(request.projectId) === String(project.id) &&
                request.status === 'accepted'
            ).length;

            return prepareProject(project, owner, accepted);
          });

        const joinedProjects = joinedResults.map(item =>
          prepareProject(
            item.project,
            item.owner,
            item.memberCount
          )
        );

        if (active) {
          setData({
            profile,
            createdProjects,
            joinedProjects,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'دریافت پروفایل با خطا مواجه شد.'
          );
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async values => {
    const profile = saveProfile(values);

    setData(previous => ({
      ...previous,
      profile,
    }));

    setEditing(false);
    setSaved(true);
  };

  const p = data?.profile;

  const links = p
  ? [
      ['GitHub', p.links.github],
      ['LinkedIn', p.links.linkedin],
      ['Email', p.links.email && `mailto:${p.links.email}`],
    ].filter(([, href]) => href)
  : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F4F6F8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Button
          component={Link}
          to="/explore"
          startIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            color: '#4B6382',
            px: 0,
            mb: 2,
            '&:hover': {
              bgcolor: 'transparent',
              color: NAVY,
            },
          }}
        >
          بازگشت به کاوش پروژه‌ها
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        {!p && !error && (
          <Typography color="text.secondary">
            در حال بارگذاری پروفایل...
          </Typography>
        )}

        {p && (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ alignItems: 'flex-start', mb: 5 }}
            >
              <Avatar
                src={p.avatarUrl || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 34,
                  bgcolor: '#CDD5DB',
                  color: NAVY,
                  flexShrink: 0,
                }}
              >
                {initials(p.name)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h4" fontWeight={800} color={NAVY}>
                  {p.name}
                </Typography>

                {p.username && (
                  <Typography
                    dir="ltr"
                    sx={{
                      color: '#7A899B',
                      fontSize: 14,
                      mt: 0.5,
                      textAlign: 'left',
                      width: 'fit-content',
                    }}
                  >
                    @{p.username}
                  </Typography>
                )}

                {p.headline && (
                  <Typography color="#4B6382" mt={0.75}>
                    {p.headline}
                  </Typography>
                )}

                {p.summary && (
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1.5, lineHeight: 1.9 }}
                  >
                    {p.summary}
                  </Typography>
                )}

                {links.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    useFlexGap
                    sx={{ flexWrap: 'wrap', alignItems: 'center', mt: 2 }}
                  >
                    {links.map(([label, href]) => (
                      <Button
                        key={label}
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        endIcon={<OutArrow fontSize="small" />}
                        sx={{
                          bgcolor: '#fff',
                          border: '1px solid #E3E8EF',
                          color: NAVY,
                          textTransform: 'none',
                          px: 1.75,
                          '&:hover': {
                            bgcolor: '#F0F3F8',
                          },
                        }}
                      >
                        {label}
                      </Button>
                    ))}

                    <Typography variant="caption" color="text.secondary">
                      لینک‌هایی که خودتان اضافه کرده‌اید
                    </Typography>
                  </Stack>
                )}

                {(p.openToCollab.enabled ||
                  p.availableToHelp.enabled) && (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    useFlexGap
                    sx={{ flexWrap: 'wrap', mt: 2.5 }}
                  >
                    {p.openToCollab.enabled && (
                      <StatusBadge color={BADGE_COLLAB}>
                        آماده‌ی همکاری
                      </StatusBadge>
                    )}

                    {p.availableToHelp.enabled && (
                      <StatusBadge color={BADGE_HELP}>
                        آماده‌ی کمک به دیگران
                      </StatusBadge>
                    )}
                  </Stack>
                )}
              </Box>

              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                sx={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  width: 'auto',
                  bgcolor: '#071739',
                  color: '#FFFFFF',
                  borderColor: '#071739',
                  px: 2,
                  py: 0.7,
                  minWidth: 'auto',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: '#0B2454',
                    borderColor: '#0B2454',
                  },
                }}
              >
                ویرایش پروفایل
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '2fr 1fr',
                },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <Stack spacing={3} sx={{ minWidth: 0 }}>
                <Section title="کمی درباره‌ی من">
                  {p.about ? (
                    <Typography
                      color="text.secondary"
                      sx={{ whiteSpace: 'pre-line', lineHeight: 2 }}
                    >
                      {p.about}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">
                      هنوز چیزی درباره‌ی خودتان ننوشته‌اید.
                      از «ویرایش پروفایل» اضافه کنید.
                    </Typography>
                  )}
                </Section>

                <Section title="مهارت‌ها و علایق">
                  {p.skills.length ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap' }}
                    >
                      {p.skills.map(skill => (
                        <Box
                          key={skill}
                          component="span"
                          sx={{
                            px: 1.75,
                            py: 0.75,
                            borderRadius: 1.5,
                            fontSize: 13,
                            bgcolor: '#F0F3F8',
                            color: '#4B6382',
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">
                      هنوز مهارتی اضافه نکرده‌اید.
                    </Typography>
                  )}
                </Section>

                <Box sx={{ pt: 1 }}>
                  <ProjectsSection
                    title="پروژه‌هایی که ایجاد کرده‌ام"
                    projects={data.createdProjects}
                  />
                </Box>

                <ProjectsSection
                  title="پروژه‌هایی که در آن‌ها عضو شده‌ام"
                  projects={data.joinedProjects}
                />
              </Stack>

              <Stack spacing={3} sx={{ minWidth: 0 }}>
                <Section title="بیایید با هم بسازیم یا یاد بگیریم.">
                  {!p.openToCollab.enabled &&
                  !p.availableToHelp.enabled ? (
                    <Typography color="text.secondary">
                      وضعیت همکاری شما خاموش است. از «ویرایش پروفایل»
                      می‌توانید آن را فعال کنید.
                    </Typography>
                  ) : (
                    <Stack spacing={2.5} sx={{ alignItems: 'flex-start' }}>
                      {p.openToCollab.enabled && (
                        <Box>
                          <StatusBadge color={BADGE_COLLAB}>
                            آماده‌ی همکاری
                          </StatusBadge>

                          {p.openToCollab.note && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ lineHeight: 1.9, mt: 1.25 }}
                            >
                              {p.openToCollab.note}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {p.availableToHelp.enabled && (
                        <Box>
                          <StatusBadge color={BADGE_HELP}>
                            آماده‌ی کمک به دیگران
                          </StatusBadge>

                          {p.availableToHelp.note && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ lineHeight: 1.9, mt: 1.25 }}
                            >
                              {p.availableToHelp.note}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Stack>
                  )}
                </Section>

                {p.helpTopics.length > 0 && (
                  <Section title="می‌توانم در این موارد کمک کنم...">
                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 0,
                        pr: 2.5,
                        color: 'text.secondary',
                        lineHeight: 2.2,
                      }}
                    >
                      {p.helpTopics.map(topic => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      یک سؤال دقیق، بهترین نقطه‌ی شروع است.
                    </Typography>
                  </Section>
                )}

                <Box
                  sx={{
                    bgcolor: NAVY,
                    color: '#fff',
                    borderRadius: 3,
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, lineHeight: 1.7 }}
                  >
                    یک سؤال خوب.
                    <br />
                    یک قدم بعدیِ مفید.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.9, mt: 1.5, color: 'rgba(255,255,255,.75)' }}
                  >
                    تبادل مهارت برای راهنمایی عملی است، نه یک مسیر طولانی.
                    آنچه امتحان کرده‌اید و جایی که گیر کرده‌اید را بنویسید.
                  </Typography>

                  <Button
                    component="a"
                    href="#"
                    endIcon={<OutArrow fontSize="small" />}
                    sx={{
                      color: BEIGE,
                      px: 0,
                      mt: 2,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    راهنمایی بگیرید در تبادل مهارت
                  </Button>
                </Box>
              </Stack>
            </Box>

            {editing && (
              <ProfileEditDialog
                open
                profile={p}
                onClose={() => setEditing(false)}
                onSave={handleSave}
              />
            )}
          </>
        )}
      </Container>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSaved(false)}
        >
          تغییرات پروفایل ذخیره شد.
        </Alert>
      </Snackbar>
    </Box>
  );
}
