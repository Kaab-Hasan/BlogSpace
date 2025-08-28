import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Breadcrumbs,
  Link,
  IconButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import Header from '../components/common/Header';
import CategoryCard from '../components/categories/CategoryCard';
import Footer from '../components/common/Footer';
import SearchIcon from '../components/icons/SearchIcon';
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

const SearchSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(3, 8),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius
  }
}));

const ViewToggle = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex'
}));

const ViewButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: 0,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.common.white : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[100]
  },
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  }
}));

const CategoriesGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '24px',
  marginTop: '32px'
});

interface CategoriesPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate, onLogout }) => {
  const { user, isAuthenticated, logout, categories, loading, fetchCategories } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'posts' | 'name'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [followingCategories, setFollowingCategories] = useState<Set<string>>(new Set());
  
  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      if (!categoriesLoaded && categories.length === 0) {
        try {
          await fetchCategories();
          setCategoriesLoaded(true);
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
    };
    
    loadCategories();
  }, [categories, fetchCategories, categoriesLoaded]);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query))
    );
  });
  
  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.followerCount || 0) - (a.followerCount || 0);
      case 'posts':
        return (b.postCount || 0) - (a.postCount || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  const handleCategoryClick = (categoryId: string) => {
    console.log('Navigate to category:', categoryId);
    // Could navigate to a specific category page or filter posts by category
    // For now, navigate to home and could pass category filter
    onNavigate?.('home');
  };
  
  const handleFollowCategory = async (categoryId: string) => {
    try {
      // For now, just update local state since backend doesn't support follow yet
      setFollowingCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error following category:', error);
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
        currentPage="categories" 
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
          <Typography color="primary.main">Categories</Typography>
        </Breadcrumbs>

        <Typography variant="h1" color="primary.main" sx={{ mb: 6 }}>
          Explore Categories
        </Typography>
      </ContentSection>

      <SearchSection>
        <Stack direction="row" spacing={3} alignItems="center">
          <SearchField
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon width={14} height={14} color="#6b7280" />
                </InputAdornment>
              )
            }}
            sx={{ width: 320 }}
          />

          <Typography variant="body2" color="text.secondary">
            {loading ? (
              <Skeleton variant="text" width={120} />
            ) : (
              `${sortedCategories.length} categories found`
            )}
          </Typography>

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.primary">
                Sort by:
              </Typography>
              <FormControl size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'posts' | 'name')}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="popular">Popular</MenuItem>
                  <MenuItem value="posts">Most Posts</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <ViewToggle>
              <ViewButton 
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <GridViewIcon />
              </ViewButton>
              <ViewButton 
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <ViewListIcon />
              </ViewButton>
            </ViewToggle>
          </Box>
        </Stack>
      </SearchSection>

      <ContentSection>
        {loading && !categoriesLoaded ? (
          // Loading skeleton
          <CategoriesGrid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ borderRadius: 2 }}
                />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </CategoriesGrid>
        ) : sortedCategories.length > 0 ? (
          // Categories grid
          <CategoriesGrid>
            {sortedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id || category.name)}
                onFollow={() => handleFollowCategory(category.id || category.name)}
              />
            ))}
          </CategoriesGrid>
        ) : (
          // No results message
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No categories found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 
                `Try adjusting your search term "${searchQuery}"` : 
                'No categories available at the moment'}
            </Typography>
          </Box>
        )}
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default CategoriesPage;