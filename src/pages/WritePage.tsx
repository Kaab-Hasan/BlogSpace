import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { PostCategory, PostStatus } from '../types/enums';
import { formatCategoryName } from '../utils/formatters';
import { useApp } from '../contexts/AppContext';

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

const EditorCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)'
}));

const PublishButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const SaveDraftButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main
  }
}));

interface WritePageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  postId?: string; // For editing existing posts
}

const WritePage: React.FC<WritePageProps> = ({ onNavigate, onLogout, postId }) => {
  const { user, isAuthenticated, logout, createPost, updatePost, categories, fetchCategories } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    categories: [] as string[],
    excerpt: '',
    content: '',
    tags: '',
    status: PostStatus.DRAFT,
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!!postId);
  
  // Load categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);
  
  // Load post data if editing
  useEffect(() => {
    if (postId && isEditing) {
      // In a real implementation, you'd fetch the post data here
      // For now, we'll just set the editing flag
      console.log('Loading post for editing:', postId);
    }
  }, [postId, isEditing]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    return true;
  };
  
  const handlePublish = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        categories: formData.categories.length > 0 ? formData.categories : [formData.categories[0] || PostCategory.TECHNOLOGY],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: PostStatus.PUBLISHED,
        isFeatured: formData.isFeatured
      };
      
      let success = false;
      if (isEditing && postId) {
        success = await updatePost(postId, postData);
      } else {
        success = await createPost(postData);
      }
      
      if (success) {
        // Navigate to home or dashboard based on user role
        if (user?.role === 'admin') {
          onNavigate?.('admin');
        } else {
          onNavigate?.('home');
        }
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      setError('Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      setError('Title is required to save draft');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get default category ID if no category selected
      const defaultCategoryId = categories.length > 0 ? categories[0].id : null;

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        categories: formData.categories.length > 0 ? formData.categories : (defaultCategoryId ? [defaultCategoryId] : []),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: PostStatus.DRAFT,
        isFeatured: formData.isFeatured
      };

      console.log('WritePage - Sending post data:', postData);
      console.log('WritePage - Available categories:', categories);
      console.log('WritePage - Selected categories:', formData.categories);
      
      let success = false;
      if (isEditing && postId) {
        success = await updatePost(postId, { ...postData, status: PostStatus.DRAFT });
      } else {
        success = await createPost(postData);
      }
      
      if (success) {
        // Show success message but stay on the page
        console.log('Draft saved successfully');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  const categoryOptions = categories.length > 0 ? categories : Object.values(PostCategory);

  return (
    <PageContainer>
      <Header 
        onNavigate={onNavigate} 
        currentPage="write" 
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
          <Typography color="primary.main">Write</Typography>
        </Breadcrumbs>

        <Typography variant="h1" color="primary.main" sx={{ mb: 2 }}>
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isEditing ? 'Update your post content and settings' : 'Share your thoughts and ideas with the BlogSpace community'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <EditorCard>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              <TextField
                fullWidth
                label="Post Title"
                placeholder="Enter an engaging title for your post"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <Stack direction="row" spacing={3}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.categories[0] || ''}
                    label="Category"
                    onChange={(e) => handleInputChange('categories', [e.target.value])}
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem key={typeof category === 'object' ? category.id : category} value={typeof category === 'object' ? category.id : category}>
                        {typeof category === 'object' ? category.name : formatCategoryName(category)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ flex: 1 }}
                  label="Tags"
                  placeholder="Enter tags separated by commas (e.g., writing, tips, tutorial)"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  helperText="Tags help readers find your content"
                />
              </Stack>
              
              <Stack direction="row" spacing={3} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Featured Post"
                />
                
                <Typography variant="body2" color="text.secondary">
                  Featured posts appear prominently on the homepage
                </Typography>
              </Stack>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Excerpt"
                placeholder="Write a brief summary of your post"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={12}
                label="Content"
                placeholder="Write your post content here..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {formData.tags && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tags:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {formData.tags.split(',').map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag.trim()} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <SaveDraftButton 
                  variant="outlined" 
                  onClick={handleSaveDraft}
                  disabled={loading || !formData.title.trim()}
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Save Draft'
                  )}
                </SaveDraftButton>
                <PublishButton 
                  onClick={handlePublish}
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    isEditing ? 'Update Post' : 'Publish Post'
                  )}
                </PublishButton>
              </Stack>
            </Stack>
          </CardContent>
        </EditorCard>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default WritePage;