import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  IconButton,
  Badge,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import UserHeader from '../components/user/UserHeader';
import { useApp } from '../contexts/AppContext';

const ProfileContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8fdf8'
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  padding: '24px',
  gap: '24px'
});

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'visible'
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease-in-out'
  }
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  ...(status === 'verified' && {
    backgroundColor: '#dcfce7',
    color: '#166534',
    '& .MuiChip-icon': {
      color: '#166534'
    }
  }),
  ...(status === 'pending' && {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  }),
  ...(status === 'premium' && {
    backgroundColor: '#e0e7ff',
    color: '#3730a3'
  })
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate, onLogout }) => {
  const { user, userStats, updateUser, logout } = useApp();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user || {});
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
  };

  const handleNewPost = () => {
    onNavigate?.('write');
  };

  const handleProfileClick = () => {
    // Already on profile page
  };

  // Calculate profile completion
  const getProfileCompletion = () => {
    if (!user) return 0;
    const fields = ['name', 'email', 'bio', 'avatar'];
    const completed = fields.filter(field => user[field as keyof typeof user]).length;
    return Math.round((completed / fields.length) * 100);
  };

  const profileCompletion = getProfileCompletion();

  // User status logic
  const getUserStatus = () => {
    if (user?.isVerified) return 'verified';
    if (user?.role === 'admin') return 'premium';
    return 'pending';
  };

  const userStatus = getUserStatus();

  if (!user) {
    return (
      <ProfileContainer>
        <Alert severity="error" sx={{ m: 3 }}>
          Please log in to view your profile.
        </Alert>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <UserHeader
        user={{
          name: user.name,
          avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
        }}
        currentPage="profile"
        onNavigate={handleNavigation}
        onNewPost={handleNewPost}
        onProfileClick={handleProfileClick}
      />

      <MainContent>
        {/* Left Sidebar - Profile Overview */}
        <Box sx={{ width: 350 }}>
          <Stack spacing={3}>
            {/* Profile Card */}
            <ProfileCard>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Box position="relative">
                    <Avatar
                      src={user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`}
                      alt={user.name}
                      sx={{ width: 100, height: 100 }}
                    />
                    <StatusChip
                      status={userStatus}
                      icon={userStatus === 'verified' ? <VerifiedIcon /> : undefined}
                      label={userStatus === 'verified' ? 'Verified' : userStatus === 'premium' ? 'Premium' : 'Pending'}
                      size="small"
                      sx={{ position: 'absolute', bottom: -8, right: -8 }}
                    />
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {user.role === 'admin' ? 'Administrator' : 'Author'}
                    </Typography>
                  </Box>

                  {/* Profile Completion */}
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Profile Completion
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        {profileCompletion}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={profileCompletion}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: profileCompletion === 100 ? '#10b981' : '#3b82f6'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </ProfileCard>

            {/* Stats Cards */}
            <Stack spacing={2}>
              <StatsCard>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                        {userStats?.totalPosts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Posts
                      </Typography>
                    </Box>
                    <EditIcon color="action" />
                  </Stack>
                </CardContent>
              </StatsCard>

              <StatsCard>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                        {userStats?.totalViews || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Views
                      </Typography>
                    </Box>
                    <Badge badgeContent={userStats?.viewsGrowth || 0} color="success">
                      <NotificationsIcon color="action" />
                    </Badge>
                  </Stack>
                </CardContent>
              </StatsCard>
            </Stack>
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1 }}>
          <ProfileCard>
            <CardContent sx={{ p: 0 }}>
              {/* Success/Error Messages */}
              {success && (
                <Alert severity="success" sx={{ m: 3, mb: 0 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ m: 3, mb: 0 }}>
                  {error}
                </Alert>
              )}

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                  <Tab label="Personal Info" />
                  <Tab label="Account Settings" />
                  <Tab label="Privacy & Security" />
                </Tabs>
              </Box>

              {/* Tab Panels */}
              <Box sx={{ p: 3 }}>
                <TabPanel value={currentTab} index={0}>
                  {/* Personal Information */}
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary.main">
                        Personal Information
                      </Typography>
                      {!isEditing ? (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                          variant="outlined"
                          size="small"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            variant="contained"
                            size="small"
                            disabled={loading}
                          >
                            Save
                          </Button>
                          <Button
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            variant="outlined"
                            size="small"
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      )}
                    </Stack>

                    <Stack spacing={3}>
                      <TextField
                        label="Full Name"
                        value={editedUser.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                      />
                      
                      <TextField
                        label="Email"
                        value={editedUser.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                        type="email"
                      />
                      
                      <TextField
                        label="Bio"
                        value={editedUser.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                      
                      <TextField
                        label="Avatar URL"
                        value={editedUser.avatar || ''}
                        onChange={(e) => handleInputChange('avatar', e.target.value)}
                        disabled={!isEditing}
                        fullWidth
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </Stack>
                  </Stack>
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                  {/* Account Settings */}
                  <Stack spacing={3}>
                    <Typography variant="h6" color="primary.main">
                      Account Settings
                    </Typography>
                    
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={<Switch checked={user.isVerified || false} disabled />}
                        label="Email Verified"
                      />
                      
                      <FormControlLabel
                        control={<Switch checked={true} />}
                        label="Email Notifications"
                      />
                      
                      <FormControlLabel
                        control={<Switch checked={false} />}
                        label="Marketing Emails"
                      />
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" color="text.primary">
                        Account Type
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.role === 'admin' ? 'Administrator Account' : 'Standard Author Account'}
                      </Typography>
                    </Stack>
                  </Stack>
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                  {/* Privacy & Security */}
                  <Stack spacing={3}>
                    <Typography variant="h6" color="primary.main">
                      Privacy & Security
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Button
                        startIcon={<SecurityIcon />}
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Change Password
                      </Button>
                      
                      <Button
                        startIcon={<SettingsIcon />}
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Two-Factor Authentication
                      </Button>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" color="text.primary">
                        Data & Privacy
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage your data and privacy settings
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ justifyContent: 'flex-start', mt: 2 }}
                      >
                        Delete Account
                      </Button>
                    </Stack>
                  </Stack>
                </TabPanel>
              </Box>
            </CardContent>
          </ProfileCard>
        </Box>
      </MainContent>
    </ProfileContainer>
  );
};

export default UserProfile;
