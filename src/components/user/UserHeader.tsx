import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Avatar,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlusIcon from '../icons/PlusIcon';
import UserProfileIcon from '../icons/UserProfileIcon';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
  position: 'static'
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pacifico, cursive',
  fontSize: '24px',
  fontWeight: 400,
  color: theme.palette.common.white,
  marginRight: theme.spacing(4)
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: '16px',
  fontWeight: 400,
  textTransform: 'none',
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  '&.active': {
    color: '#98cf98'
  }
}));

const NewPostButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#98cf98',
  color: theme.palette.primary.main,
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 400,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: '#8bc98b'
  }
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

interface UserHeaderProps {
  user: {
    name: string;
    avatar: string;
  };
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onNewPost?: () => void;
  onProfileClick?: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  currentPage = 'dashboard',
  onNavigate,
  onNewPost,
  onProfileClick
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'posts', label: 'Posts' },
    { id: 'categories', label: 'Categories' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <StyledAppBar>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Stack direction="row" alignItems="center">
          <Logo>BlogSpace</Logo>
          <Stack direction="row" spacing={1}>
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                className={currentPage === item.id ? 'active' : ''}
                onClick={() => onNavigate?.(item.id)}
              >
                {item.label}
              </NavButton>
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <NewPostButton
            startIcon={<PlusIcon width={9} height={9} color="#2e5a2e" />}
            onClick={onNewPost}
          >
            New Post
          </NewPostButton>
          
          <UserInfo onClick={onProfileClick} sx={{ cursor: 'pointer' }}>
            <UserProfileIcon width={11} height={14} color="#ffffff" />
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 32, height: 32 }}
            />
          </UserInfo>
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
};

export default UserHeader;