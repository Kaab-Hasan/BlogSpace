import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  TextField,
  Chip,
  Divider,
  CircularProgress,
  Skeleton,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeartIcon from '../components/icons/HeartIcon';
import CommentIcon from '../components/icons/CommentIcon';
import UserIcon from '../components/icons/UserIcon';
import CommentSystem from '../components/comments/CommentSystem';
import { useApp } from '../contexts/AppContext';
import ApiService from '../services/api.service';
import { formatDate, formatCategoryName } from '../utils/formatters';
import { Post } from '../contexts/AppContext';

const PageContainer = styled(Box)({
  backgroundColor: '#e8f3e8',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const HeroImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundImage',
})<{ backgroundImage?: string }>(({ backgroundImage }) => ({
  width: '100%',
  height: '384px',
  backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 8),
  backgroundColor: theme.palette.background.default,
  flex: 1
}));

const ArticleCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  marginBottom: theme.spacing(3)
}));

const AuthorCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  height: 'fit-content'
}));

const CommentCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)'
}));

const CommentItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: 16,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

const ShareButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 8,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
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

const PostCommentButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 8,
  textTransform: 'none',
  alignSelf: 'flex-end',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

interface ArticlePageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  postSlug?: string; // Post slug from URL parameters
}

const ArticlePage: React.FC<ArticlePageProps> = ({ onNavigate, onLogout, postSlug = 'default' }) => {
  const { user, isAuthenticated, logout, likePost } = useApp();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [followingAuthor, setFollowingAuthor] = useState(false);
  
  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await ApiService.getPost(postSlug);
        
        if (response.success && response.data) {
          const postData = response.data;
          const transformedPost: Post = {
            id: postData._id,
            title: postData.title,
            slug: postData.slug,
            excerpt: postData.excerpt || '',
            content: postData.content,
            featuredImage: postData.featuredImage,
            videoUrl: postData.videoUrl,
            category: postData.categories?.[0],
            author: typeof postData.author === 'object' ? {
              id: postData.author._id,
              name: postData.author.name,
              title: 'Author',
              avatar: postData.author.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
              bio: postData.author.bio,
            } : {
              id: postData.author,
              name: 'Unknown Author',
              title: 'Author',
              avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
            },
            tags: postData.tags || [],
            status: postData.status,
            likes: Array.isArray(postData.likes) ? postData.likes : [],
            views: postData.views || 0,
            isFeatured: postData.isFeatured || false,
            publishedAt: new Date(postData.createdAt || Date.now()),
            comments: 0, // Will be handled by CommentSystem
          };
          
          setPost(transformedPost);
          
          // Check if user has liked this post
          if (user && Array.isArray(transformedPost.likes)) {
            setLiked(transformedPost.likes.includes(user.id));
          }
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postSlug, user]);
  
  const handleLike = async () => {
    if (!post || !isAuthenticated) return;
    
    try {
      await likePost(post.id!);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleFollowAuthor = () => {
    setFollowingAuthor(!followingAuthor);
  };
  
  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Header 
          onNavigate={onNavigate} 
          isAuthenticated={isAuthenticated}
          user={user ? {
            name: user.name,
            avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
          } : undefined}
          onLogout={handleLogout}
        />
        
        <Skeleton variant="rectangular" height={384} />
        
        <ContentSection>
          <Stack direction="row" spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="text" width={80} />
                    </Box>
                  </Stack>
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} variant="text" height={20} sx={{ mb: 1 }} />
                  ))}
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ width: 350 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={20} sx={{ mb: 3 }} />
                  <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </ContentSection>
        
        <Footer />
      </PageContainer>
    );
  }
  
  if (error || !post) {
    return (
      <PageContainer>
        <Header 
          onNavigate={onNavigate} 
          isAuthenticated={isAuthenticated}
          user={user ? {
            name: user.name,
            avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
          } : undefined}
          onLogout={handleLogout}
        />
        
        <ContentSection>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Post not found'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => onNavigate?.('home')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </ContentSection>
        
        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header 
        onNavigate={onNavigate} 
        isAuthenticated={isAuthenticated}
        user={user ? {
          name: user.name,
          avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
        } : undefined}
        onLogout={handleLogout}
      />
      
      <HeroImage backgroundImage={post.featuredImage} />

      <ContentSection>
        <Stack direction="row" spacing={4}>
          {/* Main Article Content */}
          <Box sx={{ flex: 1 }}>
            <ArticleCard>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Typography variant="h1" color="primary.main" sx={{ mb: 2 }}>
                    {post.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip 
                      label={post.category ? formatCategoryName(post.category) : 'Article'} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {post.publishedAt ? formatDate(post.publishedAt) : formatDate(new Date())}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {post.views} views
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      src={typeof post.author === 'object' ? post.author.avatar : undefined} 
                      alt={typeof post.author === 'object' ? post.author.name : 'Author'}
                      sx={{ width: 40, height: 40 }}
                    >
                      {typeof post.author === 'object' ? post.author.name?.charAt(0) : 'A'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="primary.main">
                        {typeof post.author === 'object' ? post.author.name : 'Unknown Author'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {typeof post.author === 'object' ? post.author.title || 'Author' : 'Author'}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Article Content */}
                  <Box sx={{ my: 4 }}>
                    {post.excerpt && (
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                        {post.excerpt}
                      </Typography>
                    )}
                    
                    <Typography 
                      variant="body1" 
                      color="text.primary" 
                      sx={{ 
                        lineHeight: 1.8, 
                        '& p': { mb: 2 },
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {post.content || 'Article content is loading...'}
                    </Typography>
                  </Box>

                  {/* Engagement Section */}
                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <IconButton 
                            size="small"
                            onClick={handleLike}
                            disabled={!isAuthenticated}
                            sx={{ color: liked ? 'error.main' : 'text.secondary' }}
                          >
                            <HeartIcon width={13} height={12} />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            {Array.isArray(post.likes) ? post.likes.length : 0}
                          </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CommentIcon width={13} height={13} color="#6b7280" />
                          <Typography variant="body2" color="text.secondary">
                            {post.comments}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <ShareIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Share
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <ShareButton size="small" startIcon={<TwitterIcon />}>
                          Tweet
                        </ShareButton>
                        <ShareButton size="small" startIcon={<FacebookIcon />}>
                          Share
                        </ShareButton>
                      </Stack>
                    </Stack>

                    {post.tags && post.tags.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                        {post.tags.map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small" 
                            variant="outlined" 
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </ArticleCard>

            {/* Comments Section */}
            <CommentCard>
              <CardContent sx={{ p: 4 }}>
                <CommentSystem postId={post.id!} />
              </CardContent>
            </CommentCard>
          </Box>

          {/* Sidebar */}
          <Box sx={{ width: 350 }}>
            <Stack spacing={3}>
              {/* Author Info */}
              <AuthorCard>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar 
                      src={typeof post.author === 'object' ? post.author.avatar : undefined} 
                      alt={typeof post.author === 'object' ? post.author.name : 'Author'}
                      sx={{ width: 64, height: 64 }}
                    >
                      {typeof post.author === 'object' ? post.author.name?.charAt(0) : 'A'}
                    </Avatar>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary.main">
                        {typeof post.author === 'object' ? post.author.name : 'Unknown Author'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {typeof post.author === 'object' ? post.author.title || 'Author' : 'Author'}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {typeof post.author === 'object' && post.author.bio ? 
                        post.author.bio : 
                        'This author creates amazing content. Follow them to stay updated with their latest posts.'}
                    </Typography>

                    <FollowButton 
                      fullWidth
                      variant={followingAuthor ? 'outlined' : 'contained'}
                      onClick={handleFollowAuthor}
                      disabled={!isAuthenticated}
                    >
                      {followingAuthor ? 'Following' : `Follow ${typeof post.author === 'object' ? post.author.name?.split(' ')[0] || 'Author' : 'Author'}`}
                    </FollowButton>

                    <Typography variant="caption" color="text.secondary">
                      {typeof post.author === 'object' ? (
                        `${post.author.articlesCount || 0} articles • ${post.author.followersCount || 0} followers`
                      ) : (
                        'Author details not available'
                      )}
                    </Typography>
                  </Stack>
                </CardContent>
              </AuthorCard>

              {/* Related Articles */}
              <AuthorCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                    Related Articles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    More articles coming soon...
                  </Typography>
                </CardContent>
              </AuthorCard>
            </Stack>
          </Box>
        </Stack>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default ArticlePage;