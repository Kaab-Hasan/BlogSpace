import React from 'react';
import {
  CardContent,
  Stack,
  Box
} from '@mui/material';
import StyledCard from '../common/StyledCard';
import PostImage from '../common/PostImage';
import { PostTitle, PostExcerpt, MetaText } from '../common/PostTypography';
import StatusChip from '../common/StatusChip';
import ActionButton from '../common/ActionButton';
import EyeIcon from '../icons/EyeIcon';
import EditIcon from '../icons/EditIcon';
import { formatPublishStatus, formatReadingTime } from '../../utils/userFormatters';

interface PostCardProps {
  post: {
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
  };
  onEdit?: (postId: number) => void;
  onView?: (postId: number) => void;
  onClick?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onView,
  onClick
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <StyledCard onClick={() => onClick?.(post.id)}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2}>
          <PostImage src={post.heroImage} alt={post.title} />
          
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
              <PostTitle>{post.title}</PostTitle>
              <Stack direction="row" spacing={1}>
                <StatusChip 
                  label={formatPublishStatus(post.status)}
                  className={post.status === 'draft' ? 'draft' : ''}
                  size="small"
                />
                <ActionButton onClick={(e) => { e.stopPropagation(); onView?.(post.id); }}>
                  <EyeIcon width={14} height={12} color="#6b7280" />
                </ActionButton>
                <ActionButton onClick={(e) => { e.stopPropagation(); onEdit?.(post.id); }}>
                  <EditIcon width={12} height={13} color="#6b7280" />
                </ActionButton>
              </Stack>
            </Stack>
            
            <PostExcerpt>{post.excerpt}</PostExcerpt>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <MetaText>{post.category}</MetaText>
              <MetaText>•</MetaText>
              <MetaText>{formatDate(post.publishedAt)}</MetaText>
              <MetaText>•</MetaText>
              <MetaText>{post.comments} comments</MetaText>
              {post.status === 'published' && (
                <>
                  <MetaText>•</MetaText>
                  <MetaText>{post.views} views</MetaText>
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default PostCard;