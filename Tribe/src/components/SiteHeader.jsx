import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Avatar, Badge, Box, Button, Container, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import TribeLogo from './TribeLogo';
import SiteLink from './SiteLink';
import { LOGIN_PATH, PROFILE_KEY, getProfile } from '../services/currentUser';
import { useNotifications, markAllRead, markRead } from '../services/notificationService';
import { useChatList } from '../services/chatService';
import NotificationRow from './NotificationRow';

import { useMyStats } from '../services/membershipService';
import { useStoredJson } from '../services/store';
import { fa } from '../utils/fa';
import { useAuth } from '../hooks/useAuth.js';
import { useLogout } from '../hooks/useLogout.js';

const NAVY = '#071739';

const NAV = [
  ['کاوش پروژه‌ها', '/explore'],
  ['گفت‌وگو و مذاکره', '/chat'],
  ['یافتن افراد', null],
  ['تبادل مهارت', null],
  ['راهنمای استفاده', null],
];

const filled = { bgcolor: NAVY, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } };

const EMPTY = {};

// Bell (notification popover) + avatar menu for signed-in users
function UserMenu() {
  const [bell, setBell] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const logout = useLogout();
  const navigate = useNavigate();
  const stats = useMyStats();
  const { items: notes, unread } = useNotifications();
  const { totalUnread: chatUnread } = useChatList();
  useStoredJson(PROFILE_KEY, EMPTY); // re-render when the profile name changes

  const profile = getProfile();
  const closeBell = () => setBell(null);
  const close = () => setAnchor(null);
  const go = (to) => () => { close(); navigate(to); };
  const item = (to, Icon, label, note) => (
    <MenuItem onClick={go(to)}>
      <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
      <ListItemText primary={label} secondary={note} slotProps={{ secondary: { sx: { whiteSpace: 'normal' } } }} />
    </MenuItem>
  );
  return (
    <>
      <IconButton onClick={() => navigate('/chat')} aria-label="گفت‌وگو و مذاکره" sx={{ color: '#4B6382' }}>
        <Badge badgeContent={chatUnread} max={99} color="primary">
          <ForumOutlinedIcon />
        </Badge>
      </IconButton>
      <IconButton onClick={(e) => setBell(e.currentTarget)} aria-label="اعلان‌ها" sx={{ color: '#4B6382' }}>
        <Badge badgeContent={unread} max={99} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="منوی کاربر" size="small">
        <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#E3C39D', color: NAVY }}>
          {profile.name.trim()[0]}
        </Avatar>
      </IconButton>

      <Menu anchorEl={bell} open={Boolean(bell)} onClose={closeBell} slotProps={{ paper: { sx: { width: 360, maxWidth: 'calc(100vw - 24px)' } } }}>
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700 }}>اعلان‌ها</Typography>
          <Button size="small" disabled={unread === 0} onClick={markAllRead}>خواندن همه</Button>
        </Box>
        <Divider />
        {notes.length === 0 && <Typography color="text.secondary" sx={{ p: 2 }}>اعلان تازه‌ای ندارید</Typography>}
        {notes.slice(0, 5).map((n) => (
          <NotificationRow key={n.id} item={n} dense onOpen={(x) => { markRead(x.id); closeBell(); navigate(x.link || '/my-projects'); }} />
        ))}
        <Divider />
        <MenuItem onClick={() => { closeBell(); navigate('/notifications'); }} sx={{ justifyContent: 'center', fontWeight: 600 }}>
          مشاهده همه اعلان‌ها
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close} slotProps={{ paper: { sx: { width: 260, maxWidth: 'calc(100vw - 24px)' } } }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, wordBreak: 'break-word' }}>{profile.name}</Typography>
          {profile.headline && <Typography variant="body2" color="text.secondary">{profile.headline}</Typography>}
        </Box>
        <Divider />
        {item('/my-projects', FolderOpenOutlinedIcon, 'پروژه‌های من', stats.toReview > 0 ? `${fa(stats.toReview)} درخواست برای بررسی` : '')}
        {item('/my-projects?tab=requests', SendOutlinedIcon, 'درخواست‌های ارسالی', stats.waiting > 0 ? `${fa(stats.waiting)} در انتظار` : '')}
        {item('/chat', ForumOutlinedIcon, 'گفت‌وگو و مذاکره', chatUnread > 0 ? `${fa(chatUnread)} پیام جدید` : '')}
        {item('/profile', PersonOutlineIcon, 'پروفایل')}

        <Divider />
        <MenuItem onClick={() => { close(); logout(); }}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          خروج
        </MenuItem>
      </Menu>
    </>
  );
}

export default function SiteHeader() {
  const { isAuthenticated } = useAuth();
  return (
    <Box component="header" sx={{ bgcolor: '#fff', borderBottom: '1px solid #E3E8EF' }}>
      <Container
        maxWidth="lg"
        sx={{ py: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'nowrap' }}
      >
        <Box component={Link} to="/" aria-label="صفحه اصلی Tribe" sx={{ textDecoration: 'none' }}>
          <TribeLogo height={64} />
        </Box>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
          {NAV.map(([label, to]) => <SiteLink key={label} label={label} to={to} sx={{ fontSize: 15 }} />)}
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button component={Link} to="/my-projects" variant="contained" sx={{ ...filled, display: { xs: 'none', sm: 'inline-flex' } }}>
                داشبورد
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Button component={Link} to={LOGIN_PATH} sx={{ color: NAVY, fontWeight: 600, textTransform: 'none' }}>ورود</Button>
              <Button component={Link} to="/signup" variant="contained" sx={filled}>عضویت در Tribe</Button>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}