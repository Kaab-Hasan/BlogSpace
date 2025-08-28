import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import HeroSection from '../components/home/HeroSection';
import PostCard from '../components/home/PostCard';
import Footer from '../components/common/Footer';
import GradientBar from '../components/common/GradientBar';
import { useApp } from '../contexts/AppContext';
import { formatPostCount, formatFollowerCount, formatCategoryName } from '../utils/formatters';

const PageContainer = styled(Box)({
  backgroundColor: '#e8f3e8',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 8),
  backgroundColor: theme.palette.background.default
}));

const SidebarCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  height: 'fit-content',
  position: 'relative',
  overflow: 'hidden'
}));

const CategoryItem = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const AuthorItem = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const FollowButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.secondary.light
  }
}));

interface HomePageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLogout }) => {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    posts, 
    categories, 
    featuredAuthors, 
    loading, 
    fetchPosts, 
    fetchCategories, 
    fetchAuthors,
    likePost 
  } = useApp();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [followingAuthors, setFollowingAuthors] = useState<Set<string>>(new Set());
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  const postsPerPage = 5;
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const hasNext = indexOfLastPost < posts.length;
  
  // Fetch data on mount
  React.useEffect(() => {
    const initializeData = async () => {
      try {
        if (!postsLoaded && posts.length === 0) {
          await fetchPosts();
          setPostsLoaded(true);
        }
        if (!categoriesLoaded && categories.length === 0) {
          await fetchCategories();
          setCategoriesLoaded(true);
        }
        if (!authorsLoaded && featuredAuthors.length === 0) {
          await fetchAuthors();
          setAuthorsLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing homepage data:', error);
      }
    };
    
    initializeData();
  }, [posts, categories, featuredAuthors, fetchPosts, fetchCategories, fetchAuthors, postsLoaded, categoriesLoaded, authorsLoaded]);
  
  // Get top 5 categories sorted by follower count
  const popularCategories = React.useMemo(() => {
    return [...categories]
      .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
      .slice(0, 5);
  }, [categories]);
  
  // Loading states
  const postsLoading = loading && !postsLoaded;
  const categoriesLoading = loading && !categoriesLoaded;
  const authorsLoading = loading && !authorsLoaded;

  const handleStartWriting = () => {
    onNavigate?.('write');
  };

  const handleExplorePosts = () => {
    onNavigate?.('categories');
  };

  const handlePostClick = () => {
    onNavigate?.('article');
  };
  
  const handleFollowAuthor = async (authorId: string) => {
    // For now, just update local state since we don't have a follow endpoint
    setFollowingAuthors(prev => new Set([...prev, authorId]));
  };
  
  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };
  
  const handleLoadMore = async () => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
    } else {
      // If no more pages, refresh data
      try {
        await fetchPosts();
        setCurrentPage(1);
      } catch (error) {
        console.error('Error refreshing posts:', error);
      }
    }
  };

  return (
    <PageContainer>
      <Header 
        onNavigate={onNavigate} 
        currentPage="home" 
        isAuthenticated={isAuthenticated}
        user={user ? {
          name: user.name,
          avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
        } : undefined}
        onLogout={handleLogout}
      />
      
      <HeroSection 
        onStartWriting={handleStartWriting}
        onExplorePosts={handleExplorePosts}
      />

      <ContentSection>
        <Stack direction="row" spacing={4}>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" color="primary.main" sx={{ mb: 1 }}>
              Latest Posts
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Discover fresh perspectives and engaging stories
            </Typography>

            {postsLoading ? (
              // Loading skeleton
              <Stack spacing={4}>
                {[1, 2, 3].map((i) => (
                  <Box key={i}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="text" sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                ))}
              </Stack>
            ) : currentPosts.length > 0 ? (
              // Posts list
              <>
                {currentPosts.map((post) => (
                  <Box key={post.id} sx={{ mb: 4 }}>
                    <PostCard 
                      post={post}
                      onClick={handlePostClick}
                    />
                  </Box>
                ))}
                
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleLoadMore}
                    disabled={postsLoading}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4
                    }}
                  >
                    {postsLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : hasNext ? (
                      'Load More Posts'
                    ) : (
                      'Refresh Posts'
                    )}
                  </Button>
                </Box>
              </>
            ) : (
              // No posts message
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                No posts available at the moment.
              </Typography>
            )}
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: 350 }}>
            <Stack spacing={4}>
              {/* Popular Categories */}
              <SidebarCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 3 }}>
                    Popular Categories
                  </Typography>
                  
                  {categoriesLoading ? (
                    // Loading skeleton for categories
                    <Stack spacing={2}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Stack key={i} direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="circular" width={12} height={12} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="40%" height={16} />
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    popularCategories.map((category) => (
                      <CategoryItem 
                        key={category.id} 
                        direction="row" 
                        alignItems="center" 
                        spacing={2}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => onNavigate?.('categories')}
                      >
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: 'primary.main' 
                          }} 
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.primary">
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPostCount(category.postCount || 0)}
                          </Typography>
                        </Box>
                      </CategoryItem>
                    ))
                  )}
                </CardContent>
                <GradientBar />
              </SidebarCard>

              {/* Featured Authors */}
              <SidebarCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 3 }}>
                    Featured Authors
                  </Typography>
                  
                  {authorsLoading ? (
                    // Loading skeleton for authors
                    <Stack spacing={2}>
                      {[1, 2, 3].map((i) => (
                        <Stack key={i} direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="circular" width={40} height={40} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="80%" height={16} />
                          </Box>
                          <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    featuredAuthors.slice(0, 5).map((author) => (
                      <AuthorItem key={author.id} direction="row" alignItems="center" spacing={2}>
                        <Avatar 
                          src={author.avatar} 
                          alt={author.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {author.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                            {author.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {author.title} • {author.postsCount || 0} posts
                          </Typography>
                        </Box>
                        <FollowButton 
                          size="small"
                          onClick={() => handleFollowAuthor(author.id)}
                          disabled={followingAuthors.has(author.id)}
                        >
                          {followingAuthors.has(author.id) ? 'Following' : 'Follow'}
                        </FollowButton>
                      </AuthorItem>
                    ))
                  )}
                </CardContent>
                <GradientBar />
              </SidebarCard>
            </Stack>
          </Box>
        </Stack>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default HomePage;