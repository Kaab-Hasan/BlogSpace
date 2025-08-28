import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Post } from '../../contexts/AppContext';
import { formatDate } from '../../utils/formatters';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import GradientBar from '../common/GradientBar';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  overflow: 'hidden',
  cursor: 'pointer',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: '0.8rem',
  height: 24,
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 1
}));

const AuthorSection = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.spacing(2)
}));

const StatsSection = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`
}));

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  onLike
}) => {
  return (
    <StyledCard onClick={onClick}>
      {post.featuredImage && (
        <Box sx={{ position: 'relative' }}>
          <CategoryChip label="Writing" size="small" />
          <CardMedia
            component="img"
            height="256"
            image={post.featuredImage}
            alt={post.title}
          />
        </Box>
      )}
      
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.publishedAt || new Date())}
            </Typography>
          </Stack>

          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 500 }}>
            {post.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {post.excerpt}
          </Typography>

          <AuthorSection direction="row" spacing={1}>
            <Avatar
              src={typeof post.author === 'object' ? post.author.avatar : undefined}
              alt={typeof post.author === 'object' ? post.author.name : 'Author'}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                {typeof post.author === 'object' ? post.author.name : 'Unknown Author'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {typeof post.author === 'object' ? post.author.title || 'Author' : 'Author'}
              </Typography>
            </Box>
          </AuthorSection>

          <StatsSection direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation();
                  onLike?.();
                }}>
                  <HeartIcon width={13} height={12} color="#6b7280" />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  {post.likes}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CommentIcon width={13} height={13} color="#6b7280" />
                <Typography variant="caption" color="text.secondary">
                  {post.comments}
                </Typography>
              </Stack>
            </Stack>
          </StatsSection>
        </Stack>
      </CardContent>
      <GradientBar />
    </StyledCard>
  );
};

export default PostCard;