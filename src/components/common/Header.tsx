import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '../icons/SearchIcon';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pacifico, cursive',
  fontSize: '1.5rem',
  color: theme.palette.common.white,
  textDecoration: 'none',
  cursor: 'pointer'
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    '& fieldset': {
      borderColor: theme.palette.grey[300]
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400]
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main
    }
  }
}));

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar: string;
  };
  notificationCount?: number;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentPage = 'home',
  isAuthenticated = false,
  user,
  notificationCount = 0,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout?.();
  };

  const handleProfile = () => {
    handleMenuClose();
    onNavigate?.('user-dashboard');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Logo onClick={() => handleNavigation('home')}>
          BlogSpace
        </Logo>

        <Stack direction="row" spacing={3} alignItems="center">
          <NavButton 
            onClick={() => handleNavigation('home')}
            sx={{ color: currentPage === 'home' ? '#98cf98' : 'white' }}
          >
            Home
          </NavButton>
          <NavButton 
            onClick={() => handleNavigation('categories')}
            sx={{ color: currentPage === 'categories' ? '#98cf98' : 'white' }}
          >
            Categories
          </NavButton>
          <NavButton 
            onClick={() => handleNavigation('authors')}
            sx={{ color: currentPage === 'authors' ? '#98cf98' : 'white' }}
          >
            Authors
          </NavButton>
          <NavButton 
            onClick={() => handleNavigation('about')}
            sx={{ color: currentPage === 'about' ? '#98cf98' : 'white' }}
          >
            About
          </NavButton>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box component="form" onSubmit={handleSearch}>
            <SearchField
              size="small"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon width={14} height={14} color="#6b7280" />
                  </InputAdornment>
                )
              }}
              sx={{ width: 250 }}
            />
          </Box>

          {isAuthenticated ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon sx={{ color: 'white' }} />
              </Badge>
              <Box 
                onClick={handleProfileClick}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <Avatar 
                  src={user?.avatar} 
                  alt={user?.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body2" color="white">
                  {user?.name}
                </Typography>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                color="inherit"
                onClick={() => handleNavigation('login')}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  textTransform: 'none'
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                onClick={() => handleNavigation('write')}
                sx={{ 
                  backgroundColor: '#98cf98',
                  color: '#2e5a2e',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#7fb87f'
                  }
                }}
              >
                Write
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;