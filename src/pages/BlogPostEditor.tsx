import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RichTextEditor from '../components/editor/RichTextEditor';
import ImageUpload from '../components/editor/ImageUpload';
import TagInput from '../components/editor/TagInput';
import PublishingControls from '../components/editor/PublishingControls';
import { useApp } from '../contexts/AppContext';
import { PostCategory } from '../types/enums';
import { formatReadingTime } from '../utils/userFormatters';
import AlertService from '../utils/alerts';

const EditorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
});

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  position: 'static'
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pacifico, cursive',
  fontSize: '24px',
  fontWeight: 400,
  color: theme.palette.primary.main
}));

const AutoSaveText = styled(Typography)({
  fontSize: '13.78px',
  fontWeight: 400,
  color: '#6b7280'
});

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(10) // Space for fixed controls
}));

const EditorCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 848,
  borderRadius: 20,
  border: '1px solid #f3f4f6',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  overflow: 'visible'
}));

const TitleField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    border: 'none',
    '& fieldset': {
      border: 'none'
    },
    '&:hover fieldset': {
      border: 'none'
    },
    '&.Mui-focused fieldset': {
      border: 'none'
    }
  },
  '& .MuiInputBase-input': {
    fontSize: '30px',
    fontWeight: 400,
    color: '#9ca3af',
    padding: 0,
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1
    }
  }
}));

const CharacterCount = styled(Typography)({
  fontSize: '13.78px',
  fontWeight: 400,
  color: '#9ca3af',
  textAlign: 'right'
});

const SectionLabel = styled(Typography)({
  fontSize: '14px',
  fontWeight: 400,
  color: '#374151',
  marginBottom: '8px'
});

const CategorySelect = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  }
}));

const ReadingTimeChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: '#f9fafb',
  color: '#4b5563',
  fontSize: '15.88px',
  fontWeight: 400,
  '& .MuiChip-icon': {
    color: '#9ca3af'
  }
}));

interface BlogPostEditorProps {
  onNavigate?: (page: string) => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ onNavigate }) => {
  const { createPost, categories, fetchCategories, loading } = useApp();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Fetch categories on mount
  React.useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  const handleBack = () => {
    onNavigate?.('dashboard');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Calculate reading time based on content length
    const wordCount = (value + content).split(' ').length;
    setReadingTime(Math.ceil(wordCount / 200)); // Assuming 200 words per minute
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    // Calculate reading time based on content length
    const wordCount = (title + value).split(' ').length;
    setReadingTime(Math.ceil(wordCount / 200));
  };

  const handleImageUpload = (file: File | null, url: string) => {
    setFeaturedImageFile(file);
    setFeaturedImageUrl(url);
  };

  const generateExcerpt = (content: string, maxLength: number = 150): string => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) {
      return plainText;
    }
    return plainText.substring(0, maxLength).trim() + '...';
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      AlertService.warning('Title Required', 'Please add a title before saving your draft.');
      return;
    }
    
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || generateExcerpt(content),
        categories: category ? [category] : [],
        tags: tags.filter(tag => tag.trim()),
        status: 'draft',
        isFeatured,
        featuredImage: featuredImageFile || undefined,
        video: videoFile || undefined,
      };
      
      const success = await createPost(postData);
      if (success) {
        AlertService.toast.success('Draft saved successfully!');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      AlertService.error('Save Failed', 'Failed to save draft. Please try again.');
    }
  };

  const handlePreview = () => {
    if (!title.trim() || !content.trim()) {
      AlertService.warning('Content Required', 'Please add a title and content before previewing.');
      return;
    }
    
    console.log('Opening preview...');
    AlertService.info('Preview', 'Opening preview in a new window...');
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      AlertService.error('Title Required', 'Please add a title before publishing.');
      return;
    }
    
    if (!content.trim()) {
      AlertService.error('Content Required', 'Please add content before publishing.');
      return;
    }
    
    if (!category) {
      AlertService.error('Category Required', 'Please select a category before publishing.');
      return;
    }
    
    const result = await AlertService.confirm(
      'Publish Article',
      'Are you sure you want to publish this article? It will be visible to all readers.',
      'Yes, Publish',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      try {
        const postData = {
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || generateExcerpt(content),
          categories: [category],
          tags: tags.filter(tag => tag.trim()),
          status: 'published',
          isFeatured,
          featuredImage: featuredImageFile || undefined,
          video: videoFile || undefined,
        };
        
        const success = await createPost(postData);
        if (success) {
          // Navigate back to dashboard after successful publish
          setTimeout(() => {
            onNavigate?.('dashboard');
          }, 1500);
        }
      } catch (error) {
        console.error('Error publishing article:', error);
        AlertService.error('Publish Failed', 'Failed to publish article. Please try again.');
      }
    }
  };

  return (
    <EditorContainer>
      <Header>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Logo>logo</Logo>
          </Stack>
          
          <AutoSaveText>Auto-saved</AutoSaveText>
          
          <Box sx={{ width: 48 }} /> {/* Spacer for center alignment */}
        </Toolbar>
      </Header>

      <MainContent>
        <EditorCard>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Title Section */}
              <Box>
                <TitleField
                  fullWidth
                  placeholder="Enter your article title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  variant="outlined"
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                  <SectionLabel>Title</SectionLabel>
                  <CharacterCount>0/100</CharacterCount>
                </Stack>
              </Box>

              {/* Category and Reading Time */}
              <Stack direction="row" spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <SectionLabel>Category</SectionLabel>
                  <CategorySelect fullWidth>
                    <InputLabel>Select a category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Select a category"
                      disabled={loading}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name.replace(/_/g, ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                      {/* Show message when categories haven't loaded */}
                      {categories.length === 0 && (
                        <MenuItem disabled>
                          Loading categories...
                        </MenuItem>
                      )}
                    </Select>
                  </CategorySelect>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <SectionLabel>Reading Time</SectionLabel>
                  <ReadingTimeChip
                    icon={<span>🕐</span>}
                    label={formatReadingTime(readingTime)}
                  />
                </Box>
              </Stack>

              {/* Content Editor */}
              <Box>
                <SectionLabel>Content</SectionLabel>
                <RichTextEditor
                  value={content}
                  onChange={handleContentChange}
                />
              </Box>

              {/* Featured Image */}
              <Box>
                <SectionLabel>Featured Image</SectionLabel>
                <ImageUpload
                  value={featuredImageUrl}
                  onChange={handleImageUpload}
                />
              </Box>

              {/* Tags */}
              <Box>
                <SectionLabel>Tags</SectionLabel>
                <TagInput
                  value={tags}
                  onChange={setTags}
                />
              </Box>
            </Stack>
          </CardContent>
        </EditorCard>
      </MainContent>

      <PublishingControls
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onPublish={handlePublish}
      />
    </EditorContainer>
  );
};

export default BlogPostEditor;