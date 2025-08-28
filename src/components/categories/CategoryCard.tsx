import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Category } from '../../types/schema';
import { formatCategoryName, formatPostCount, formatFollowerCount } from '../../utils/formatters';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)'
  },
  height: '100%'
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2)
}));

const FollowButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  fontSize: '0.75rem',
  height: 20
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

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  onFollow?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  onFollow
}) => {
  const getStatusChip = () => {
    if (category.trending) {
      return (
        <StatusChip 
          label="Trending" 
          size="small"
          sx={{ backgroundColor: '#22c55e', color: '#16a34a' }}
        />
      );
    }
    if (category.popular) {
      return (
        <StatusChip 
          label="Popular" 
          size="small"
          sx={{ backgroundColor: '#3b82f6', color: '#2563eb' }}
        />
      );
    }
    if (category.isNew) {
      return (
        <StatusChip 
          label="New" 
          size="small"
          sx={{ backgroundColor: '#f97316', color: '#ea580c' }}
        />
      );
    }
    return null;
  };

  return (
    <StyledCard onClick={onClick}>
      {getStatusChip()}
      <CardContent sx={{ p: 3, pb: 2 }}>
        <Stack spacing={2} alignItems="flex-start">
          <CategoryIcon>
            <Typography variant="h6" color="white">
              {formatCategoryName(category.name)?.charAt(0) || '?'}
            </Typography>
          </CategoryIcon>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 1, fontWeight: 500 }}>
              {formatCategoryName(category.name) || 'Unknown Category'}
            </Typography>

            {category.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.6,
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {category.description}
              </Typography>
            )}

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {formatPostCount(category.postCount || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFollowerCount(category.followerCount || 0)}
              </Typography>
            </Stack>

            <FollowButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onFollow?.();
              }}
            >
              Follow
            </FollowButton>
          </Box>
        </Stack>
      </CardContent>
      <GradientBar />
    </StyledCard>
  );
};

export default CategoryCard;