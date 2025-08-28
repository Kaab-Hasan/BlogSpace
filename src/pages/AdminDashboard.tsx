import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Badge,
  IconButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatsCard from '../components/admin/StatsCard';
import SearchIcon from '../components/icons/SearchIcon';
import UserIcon from '../components/icons/UserIcon';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import CommentIcon from '@mui/icons-material/Comment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../contexts/AppContext';
import { formatUserRole, formatDate, formatCategoryName } from '../utils/formatters';
import GradientBar from '../components/common/GradientBar';

const DashboardContainer = styled(Box)({
  display: 'flex',
  backgroundColor: '#f8faf8',
  minHeight: '100vh'
});

const MainContent = styled(Box)({
  flex: 1,
  marginLeft: 256,
  display: 'flex',
  flexDirection: 'column'
});

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const ContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1
}));

const StatsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '24px',
  marginBottom: '32px'
});

const TableCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden'
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  border: `2px dashed ${theme.palette.grey[300]}`,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[50]
  }
}));

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const { 
    user, 
    isAuthenticated,
    logout,
    posts, 
    dashboardStats, 
    notifications,
    loading,
    fetchPosts, 
    fetchDashboardStats,
    createPost,
    createCategory
  } = useApp();
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);

  // Load dashboard data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!statsLoaded && !dashboardStats) {
          await fetchDashboardStats();
          setStatsLoaded(true);
        }
        if (!postsLoaded && posts.length === 0) {
          await fetchPosts({ limit: 5 }); // Get recent 5 posts
          setPostsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadDashboardData();
  }, [dashboardStats, posts, fetchDashboardStats, fetchPosts, statsLoaded, postsLoaded]);

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-post':
        onNavigate?.('write');
        break;
      case 'add-user':
        // Could implement user management later
        console.log('Add user functionality not implemented');
        break;
      case 'create-category':
        // Could implement category creation modal
        console.log('Create category functionality not implemented');
        break;
    }
  };
  
  // Get recent posts from the posts array
  const recentPosts = posts.slice(0, 5);
  
  // Mock recent users for now (since we don't have user management endpoints)
  const recentUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'author' as const,
      avatar: 'https://i.pravatar.cc/150?img=1',
      joinedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user' as const,
      avatar: 'https://i.pravatar.cc/150?img=2',
      joinedAt: new Date('2024-01-20'),
    },
  ];

  return (
    <DashboardContainer>
      <AdminSidebar 
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
        onLogout={handleLogout}
      />
      
      <MainContent>
        <Header>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton>
              <MenuIcon />
            </IconButton>
            <TextField
              size="small"
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon width={14} height={14} color="#6b7280" />
                  </InputAdornment>
                )
              }}
              sx={{ width: 320 }}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <NotificationsIcon />
            </Badge>
            <UserIcon width={11} height={14} color="#2e5a2e" />
            <Box>
              <Typography variant="body2" color="text.primary">
                {user?.name || 'Admin User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Stack>
        </Header>

        <ContentArea>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your blog's performance and manage content
            </Typography>
          </Box>

          <StatsGrid>
            {loading && !statsLoaded ? (
              // Loading skeleton for stats
              <>  
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} sx={{ borderRadius: 2, p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" height={32} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <StatsCard
                  title="Total Posts"
                  value={dashboardStats?.totalPosts || posts.length}
                  growth={dashboardStats?.postsGrowth || 0}
                  icon={<ArticleIcon sx={{ color: 'white', fontSize: 20 }} />}
                />
                <StatsCard
                  title="Total Users"
                  value={dashboardStats?.totalUsers || 0}
                  growth={dashboardStats?.usersGrowth || 0}
                  icon={<PeopleIcon sx={{ color: 'white', fontSize: 20 }} />}
                />
                <StatsCard
                  title="Total Comments"
                  value={dashboardStats?.totalComments || 0}
                  growth={dashboardStats?.commentsGrowth || 0}
                  icon={<CommentIcon sx={{ color: 'white', fontSize: 20 }} />}
                />
                <StatsCard
                  title="Active Users"
                  value={dashboardStats?.activeUsers || 0}
                  growth={dashboardStats?.activeUsersGrowth || 0}
                  icon={<TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />}
                />
              </>
            )}
          </StatsGrid>

          <Stack direction="row" spacing={3}>
            {/* Recent Posts */}
            <Box sx={{ flex: 1 }}>
              <TableCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 3 }}>
                    Recent Posts
                  </Typography>
                  
                  <Table>
                    <TableHead sx={{ backgroundColor: 'grey.50' }}>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading && !postsLoaded ? (
                        // Loading skeleton for posts
                        <>  
                          {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Box>
                                  <Skeleton variant="text" width="80%" />
                                  <Skeleton variant="text" width="40%" height={16} />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Skeleton variant="circular" width={24} height={24} />
                                  <Skeleton variant="text" width={100} />
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : recentPosts.length > 0 ? (
                        recentPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" color="text.primary">
                                  {post.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {post.category ? formatCategoryName(post.category) : 'Uncategorized'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar 
                                  src={typeof post.author === 'object' ? post.author.avatar : undefined} 
                                  alt={typeof post.author === 'object' ? post.author.name : 'Author'}
                                  sx={{ width: 24, height: 24 }}
                                >
                                  {typeof post.author === 'object' ? post.author.name?.charAt(0) : 'A'}
                                </Avatar>
                                <Typography variant="body2">
                                  {typeof post.author === 'object' ? post.author.name : 'Unknown Author'}
                                </Typography>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No posts available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant="text" 
                      color="secondary"
                      onClick={() => onNavigate?.('home')}
                    >
                      View All Posts
                    </Button>
                  </Box>
                </CardContent>
                <GradientBar />
              </TableCard>
            </Box>

            {/* Recent Users */}
            <Box sx={{ flex: 1 }}>
              <TableCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 3 }}>
                    Recent Users
                  </Typography>
                  
                  <Table>
                    <TableHead sx={{ backgroundColor: 'grey.50' }}>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar 
                                src={user.avatar} 
                                alt={user.name}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Box>
                                <Typography variant="body2" color="text.primary">
                                  {user.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Joined {formatDate(user.joinedAt!)}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={formatUserRole(user.role as any)}
                              size="small"
                              color={user.role === 'author' ? 'primary' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button variant="text" color="secondary">
                      View All Users
                    </Button>
                  </Box>
                </CardContent>
                <GradientBar />
              </TableCard>
            </Box>
          </Stack>

          {/* Quick Actions */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            
            <Stack direction="row" spacing={3}>
              <QuickActionCard sx={{ flex: 1 }} onClick={() => handleQuickAction('create-post')}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AddIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.primary">
                    Create New Post
                  </Typography>
                </CardContent>
              </QuickActionCard>
              
              <QuickActionCard sx={{ flex: 1 }} onClick={() => handleQuickAction('add-user')}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AddIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.primary">
                    Add New User
                  </Typography>
                </CardContent>
              </QuickActionCard>
              
              <QuickActionCard sx={{ flex: 1 }} onClick={() => handleQuickAction('create-category')}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AddIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.primary">
                    Create Category
                  </Typography>
                </CardContent>
              </QuickActionCard>
            </Stack>
          </Box>
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;