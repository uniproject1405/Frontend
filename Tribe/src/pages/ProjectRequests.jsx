
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useParams } from 'react-router';

import {
  getProjectById,
  getProjectRequests,
  updateRequestStatus,
} from '../services/mockProjectService';

import { directory } from '../mocks/owners';
import { fa } from '../utils/fa';

import JoinRequestCard from '../components/JoinRequestCard';
import TeamGlance from '../components/TeamGlance';
import DecisionToast from '../components/DecisionToast';

const NAVY = '#071739';

function EmptyState({ tab, hasRequests }) {
  const content = {
    pending: hasRequests
      ? ['درخواست در انتظاری وجود ندارد', 'همه درخواست‌های عضویت بررسی شده‌اند.']
      : ['هنوز درخواستی دریافت نکرده‌اید', 'وقتی کسی برای عضویت در پروژه درخواست بدهد، اینجا نمایش داده می‌شود.'],
    accepted: ['هنوز عضوی پذیرفته نشده است', 'درخواست‌های پذیرفته‌شده در این بخش نمایش داده می‌شوند.'],
    rejected: ['درخواستی رد نشده است', 'درخواست‌هایی که رد می‌کنید در این بخش قرار می‌گیرند.'],
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #E3E8EF',
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography fontWeight={700} color={NAVY} mb={1}>
        {content[tab][0]}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {content[tab][1]}
      </Typography>
    </Box>
  );
}

export default function ProjectRequests() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [tab, setTab] = useState('pending');
  const [recent, setRecent] = useState(() => new Set());
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const [projectData, requestData] = await Promise.all([
        getProjectById(projectId),
        getProjectRequests(projectId),
      ]);

      if (!Array.isArray(requestData)) {
        throw new Error('داده‌های درخواست‌ها نامعتبر است.');
      }

      setProject(projectData);
      setRequests(requestData);
    } catch (error) {
      setLoadError(error.message || 'بارگذاری درخواست‌ها ممکن نشد.');
      setProject(null);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const accepted = requests.filter(
    (request) => request.status === 'accepted'
  ).length;

  const pendingCount = requests.filter(
    (request) => request.status === 'pending'
  ).length;

  const acceptedCount = accepted;

  const rejectedCount = requests.filter(
    (request) => request.status === 'rejected'
  ).length;

  const canAccept = project
    ? accepted < Number(project.capacity)
    : false;

  const visibleRequests = requests
    .filter((request) => {
      if (tab === 'pending') {
        return request.status === 'pending' || recent.has(request.id);
      }

      return request.status === tab;
    })
    .map((request) => {
      const person = directory[request.userId] || {};

      return {
        ...request,
        id: request.id,
        name:
          person.name ||
          request.applicantName ||
          request.userName ||
          request.applicant?.name ||
          'نام متقاضی نامشخص',
        role: person.headline || '',
        appliedAt: request.createdAt,
        skills: Array.isArray(person.skills) ? person.skills : [],
        message: request.message || '',
      };
    });

  async function handleDecision(request, decision) {
    if (busyId !== null) return;

    setBusyId(request.id);
    setActionError('');

    try {
      const updated = await updateRequestStatus(request.id, decision);

      setRequests((previous) =>
        previous.map((item) =>
          String(item.id) === String(updated.id) ? updated : item
        )
      );

      setRecent((previous) => new Set([...previous, request.id]));

      setToast({
        title:
          decision === 'accepted'
            ? 'درخواست پذیرفته شد'
            : 'درخواست رد شد',
        text:
          decision === 'accepted'
            ? `درخواست ${request.name} با موفقیت پذیرفته شد.`
            : `درخواست ${request.name} رد شد.`,
      });
    } catch (error) {
      setActionError(
        error.message || 'ثبت تصمیم انجام نشد. دوباره تلاش کنید.'
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', pb: 4 }}>
      <DecisionToast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <Button
        component={Link}
        to="/my-projects"
        startIcon={<ArrowForwardIcon />}
        sx={{
          mb: 3,
          color: NAVY,
          fontWeight: 700,
        }}
      >
        بازگشت به پروژه‌های من
      </Button>

      <Box mb={4}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 26, sm: 32 },
            fontWeight: 800,
            color: NAVY,
            mb: 1,
          }}
        >
          بررسی درخواست‌های عضویت
        </Typography>

        <Typography color="text.secondary">
          {project?.title || 'درخواست‌های عضویت پروژه'}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={1}
          lineHeight={2}
        >
          درخواست‌های عضویت را بررسی کنید و هم‌تیمی‌های مناسب را به پروژه خود اضافه کنید.
        </Typography>
      </Box>

      {loading && (
        <Box
          sx={{
            minHeight: 250,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography color="text.secondary">
              در حال بارگذاری درخواست‌ها...
            </Typography>
          </Stack>
        </Box>
      )}

      {!loading && loadError && (
        <Stack spacing={2}>
          <Alert severity="error">{loadError}</Alert>
          <Button
            variant="outlined"
            onClick={loadData}
            sx={{ alignSelf: 'flex-start' }}
          >
            تلاش دوباره
          </Button>
        </Stack>
      )}

      {!loading && !loadError && project && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'minmax(0, 2fr) minmax(260px, 1fr)',
            },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                borderBottom: '1px solid #E3E8EF',
                mb: 3,
              }}
            >
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 700,
                    minWidth: 'auto',
                  },
                  '& .Mui-selected': {
                    color: NAVY,
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: NAVY,
                  },
                }}
              >
                <Tab
                  value="pending"
                  label={`در انتظار (${fa(pendingCount)})`}
                />
                <Tab
                  value="accepted"
                  label={`پذیرفته‌شده (${fa(acceptedCount)})`}
                />
                <Tab
                  value="rejected"
                  label={`ردشده (${fa(rejectedCount)})`}
                />
              </Tabs>
            </Box>

            {actionError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {actionError}
              </Alert>
            )}

            {visibleRequests.length === 0 ? (
              <EmptyState
                tab={tab}
                hasRequests={requests.length > 0}
              />
            ) : (
              <Stack spacing={2}>
                {visibleRequests.map((request) => (
                  <JoinRequestCard
                    key={request.id}
                    request={request}
                    busy={busyId === request.id}
                    canAccept={canAccept}
                    onDecide={handleDecision}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <TeamGlance
            capacity={Number(project.capacity) || 0}
            accepted={accepted}
            hasRequests={requests.length > 0}
          />
        </Box>
      )}
    </Box>
  );
}
