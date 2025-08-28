import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useApp } from '../contexts/AppContext';
import { formatArticleCount, formatFollowerCount } from '../utils/formatters';

const PageContainer = styled(Box)({
  backgroundColor: '#f8fbf8',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 8),
  flex: 1
}));

const AuthorsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '24px',
  marginTop: '32px'
});

const AuthorCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const GradientBar = styled(Box)(({ theme }) => ({
  height: 4,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  borderRadius: '0 0 16px 16px',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
}));

const FollowButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 8,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

interface AuthorsPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ onNavigate, onLogout }) => {
  const { user, isAuthenticated, logout, featuredAuthors, loading, fetchAuthors } = useApp();
  const [followingAuthors, setFollowingAuthors] = useState<Set<string>>(new Set());
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  
  // Fetch authors on mount
  useEffect(() => {
    const loadAuthors = async () => {
      if (!authorsLoaded && featuredAuthors.length === 0) {
        try {
          await fetchAuthors();
          setAuthorsLoaded(true);
        } catch (error) {
          console.error('Error loading authors:', error);
        }
      }
    };
    
    loadAuthors();
  }, [featuredAuthors, fetchAuthors, authorsLoaded]);
  
  const handleFollowAuthor = async (authorId: string) => {
    try {
      // For now, just update local state since backend doesn't support follow yet
      setFollowingAuthors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(authorId)) {
          newSet.delete(authorId);
        } else {
          newSet.add(authorId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error following author:', error);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  return (
    <PageContainer>
      <Header 
        onNavigate={onNavigate} 
        currentPage="authors" 
        isAuthenticated={isAuthenticated}
        user={user ? {
          name: user.name,
          avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
        } : undefined}
        onLogout={handleLogout}
      />
      
      <ContentSection>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            underline="hover" 
            color="text.secondary" 
            onClick={() => onNavigate?.('home')}
            sx={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Typography color="primary.main">Authors</Typography>
        </Breadcrumbs>

        <Typography variant="h1" color="primary.main" sx={{ mb: 2 }}>
          Featured Authors
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Discover talented writers and their amazing content
        </Typography>

        {loading && !authorsLoaded ? (
          // Loading skeleton
          <AuthorsGrid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AuthorCard key={i}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Stack spacing={3} alignItems="center">
                    <Skeleton variant="circular" width={80} height={80} />
                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                      <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
                      <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto', mt: 1 }} />
                      <Skeleton variant="text" width="70%" height={16} sx={{ mx: 'auto', mt: 1 }} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                  </Stack>
                </CardContent>
              </AuthorCard>
            ))}
          </AuthorsGrid>
        ) : featuredAuthors.length > 0 ? (
          <AuthorsGrid>
            {featuredAuthors.map((author) => (
              <AuthorCard key={author.id}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Stack spacing={3} alignItems="center">
                    <Avatar 
                      src={author.avatar} 
                      alt={author.name}
                      sx={{ width: 80, height: 80 }}
                    >
                      {author.name?.charAt(0)}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                        {author.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {author.title || 'Author'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatArticleCount(author.postsCount || 0)} • {formatFollowerCount(author.followersCount || 0)}
                      </Typography>
                    </Box>

                    <FollowButton 
                      size="small"
                      onClick={() => handleFollowAuthor(author.id)}
                      variant={followingAuthors.has(author.id) ? 'outlined' : 'contained'}
                    >
                      {followingAuthors.has(author.id) ? 'Following' : 'Follow'}
                    </FollowButton>
                  </Stack>
                </CardContent>
                <GradientBar />
              </AuthorCard>
            ))}
          </AuthorsGrid>
        ) : (
          // No authors message
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No authors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for featured authors
            </Typography>
          </Box>
        )}
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default AuthorsPage;