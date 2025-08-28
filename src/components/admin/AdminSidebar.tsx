import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '../icons/DashboardIcon';
import PostsIcon from '@mui/icons-material/Article';
import UsersIcon from '@mui/icons-material/People';
import CategoriesIcon from '@mui/icons-material/Category';
import CommentsIcon from '@mui/icons-material/Comment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/ExitToApp';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 256,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    border: 'none'
  }
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pacifico, cursive',
  fontSize: '1.5rem',
  color: theme.palette.common.white,
  padding: theme.spacing(3, 3, 1, 3)
}));

const AdminLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.secondary.main,
  paddingLeft: theme.spacing(3),
  paddingBottom: theme.spacing(2)
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: 8,
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: theme.palette.common.white,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const StyledListItemIcon = styled(ListItemIcon)({
  color: 'white',
  minWidth: 40
});

interface AdminSidebarProps {
  selectedItem?: string;
  onItemSelect?: (item: string) => void;
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  selectedItem = 'dashboard',
  onItemSelect,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon width={12} height={12} /> },
    { id: 'posts', label: 'Posts', icon: <PostsIcon /> },
    { id: 'users', label: 'Users', icon: <UsersIcon /> },
    { id: 'categories', label: 'Categories', icon: <CategoriesIcon /> },
    { id: 'comments', label: 'Comments', icon: <CommentsIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Stack sx={{ height: '100%' }}>
        <Box>
          <Logo>BlogSpace</Logo>
          <AdminLabel>Admin Panel</AdminLabel>
        </Box>

        <List sx={{ flex: 1, px: 1 }}>
          {menuItems.map((item) => (
            <StyledListItemButton
              key={item.id}
              selected={selectedItem === item.id}
              onClick={() => onItemSelect?.(item.id)}
            >
              <StyledListItemIcon>
                {item.icon}
              </StyledListItemIcon>
              <ListItemText primary={item.label} />
            </StyledListItemButton>
          ))}
        </List>

        <Box sx={{ p: 1 }}>
          <StyledListItemButton onClick={onLogout}>
            <StyledListItemIcon>
              <LogoutIcon />
            </StyledListItemIcon>
            <ListItemText primary="Logout" />
          </StyledListItemButton>
        </Box>
      </Stack>
    </StyledDrawer>
  );
};

export default AdminSidebar;