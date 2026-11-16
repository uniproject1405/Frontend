import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, Box, Button, Container, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import TribeLogo from './TribeLogo';
import SiteLink from './SiteLink';
import { LOGIN_PATH, getProfile } from '../services/currentUser';
import { useAuth } from '../features/auth/useAuth.js';
import { useLogout } from '../features/logout/index.js';

const NAVY = '#071739';

const NAV = [
  ['کاوش پروژه‌ها', '/explore'],
  ['یافتن افراد', null],
  ['تبادل مهارت', null],
  ['راهنمای استفاده', null],
];

const filled = { bgcolor: NAVY, textTransform: 'none', '&:hover': { bgcolor: '#0E2452' } };

function UserMenu() {
  const [anchor, setAnchor] = useState(null);
  const logout = useLogout();
  const close = () => setAnchor(null);
  const item = (to, Icon, label) => (
    <MenuItem component={Link} to={to} onClick={close}>
      <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
      {label}
    </MenuItem>
  );
  return (
    <>
      <IconButton component={Link} to="/notifications" aria-label="اعلان‌ها" sx={{ color: '#4B6382' }}>
        <NotificationsNoneIcon />
      </IconButton>
      <IconButton onClick={e => setAnchor(e.currentTarget)} aria-label="منوی کاربر" size="small">
        <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: '#E3C39D', color: NAVY }}>
          {getProfile().name.trim()[0]}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        {item('/my-projects', FolderOpenOutlinedIcon, 'پروژه‌های من')}
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
        sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        <Box component={Link} to="/" aria-label="صفحه اصلی Tribe" sx={{ textDecoration: 'none' }}>
          <TribeLogo height={100} />
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
