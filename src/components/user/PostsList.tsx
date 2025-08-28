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
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PostCard from './PostCard';
import SearchIcon from '../icons/SearchIcon';

const Container = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: '#f8fdf8'
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '30px',
  fontWeight: 400,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  lineHeight: '36px'
}));

const Subtitle = styled(Typography)({
  fontSize: '15.63px',
  fontWeight: 400,
  color: '#4b5563'
});

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.common.white
  }
}));

const CategorySelect = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.common.white
  }
}));

interface PostsListProps {
  posts: Array<{
    id: number;
    title: string;
    excerpt: string;
    category: string;
    status: string;
    publishedAt: Date;
    views: number;
    comments: number;
    readingTime: number;
    heroImage: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    postCount: number;
  }>;
  selectedFilter?: string;
  onEditPost?: (postId: number) => void;
  onViewPost?: (postId: number) => void;
  onPostClick?: (postId: number) => void;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  categories,
  selectedFilter = 'all',
  onEditPost,
  onViewPost,
  onPostClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    // Filter by status based on selectedFilter
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'published':
        matchesFilter = post.status === 'published';
        break;
      case 'drafts':
        matchesFilter = post.status === 'draft';
        break;
      case 'recent':
        // Show posts from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesFilter = post.publishedAt >= thirtyDaysAgo;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <Container>
      <Header>
        <Title>Blog Posts</Title>
        <Subtitle>Manage your blog content and publications</Subtitle>
      </Header>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <SearchField
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
          sx={{ flex: 1, maxWidth: 400 }}
        />
        
        <CategorySelect>
          <InputLabel>All Categories</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="All Categories"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name.replace('_', ' ')} ({category.postCount})
              </MenuItem>
            ))}
          </Select>
        </CategorySelect>
      </Stack>

      <Box>
        {filteredPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No posts found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={onEditPost}
              onView={onViewPost}
              onClick={onPostClick}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default PostsList;