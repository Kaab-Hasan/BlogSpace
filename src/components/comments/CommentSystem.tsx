import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Stack,
  IconButton,
  Collapse,
  Chip,
  Skeleton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useApp } from '../../contexts/AppContext';

// Helper function to format relative time
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
};

const CommentCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
}));

const ReplyCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginLeft: theme.spacing(4),
  borderRadius: 8,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
}));

const CommentInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: string[];
  replies?: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  postId: string;
  showCommentForm?: boolean;
}

const CommentSystem: React.FC<CommentSystemProps> = ({ postId, showCommentForm = true }) => {
  const { user, isAuthenticated, createComment, deleteComment, loading } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      // For now, simulate fetching comments since we don't have fetchComments in context
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock comments for demonstration
      const mockComments: Comment[] = [
        {
          _id: '1',
          content: 'Great article! Really enjoyed reading this.',
          author: {
            _id: 'user1',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=1',
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: ['user2', 'user3'],
          replies: [
            {
              _id: '2',
              content: 'I agree! The insights were very helpful.',
              author: {
                _id: 'user2',
                name: 'Jane Smith',
                avatar: 'https://i.pravatar.cc/150?img=2',
              },
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              likes: ['user1'],
              parentId: '1',
            },
          ],
        },
        {
          _id: '3',
          content: 'Thanks for sharing this valuable information!',
          author: {
            _id: 'user3',
            name: 'Mike Johnson',
            avatar: 'https://i.pravatar.cc/150?img=3',
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          likes: [],
        },
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      const success = await createComment(postId, newComment.trim());
      if (success) {
        setNewComment('');
        // Refresh comments
        fetchComments();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !isAuthenticated) return;

    try {
      const success = await createComment(postId, replyContent.trim(), parentId);
      if (success) {
        setReplyContent('');
        setReplyTo(null);
        // Refresh comments
        fetchComments();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) return;

    // Optimistic update
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    // In a real implementation, this would call the API
    // await ApiService.toggleLikeComment(commentId);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const CardComponent = isReply ? ReplyCard : CommentCard;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment._id);
    const isLiked = likedComments.has(comment._id);

    return (
      <Box key={comment._id}>
        <CardComponent>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2}>
              <Avatar
                src={comment.author.avatar}
                alt={comment.author.name}
                sx={{ width: 40, height: 40 }}
              >
                {comment.author.name.charAt(0)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {comment.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Typography>
                </Stack>
                
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {comment.content}
                </Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    size="small"
                    startIcon={<ThumbUpIcon />}
                    onClick={() => handleLikeComment(comment._id)}
                    sx={{
                      color: isLiked ? 'primary.main' : 'text.secondary',
                      minWidth: 'auto',
                      px: 1,
                    }}
                  >
                    {comment.likes.length}
                  </Button>
                  
                  {!isReply && isAuthenticated && (
                    <Button
                      size="small"
                      startIcon={<ReplyIcon />}
                      onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                      sx={{ color: 'text.secondary', minWidth: 'auto', px: 1 }}
                    >
                      Reply
                    </Button>
                  )}
                  
                  {hasReplies && (
                    <Button
                      size="small"
                      onClick={() => toggleReplies(comment._id)}
                      sx={{ color: 'text.secondary', minWidth: 'auto', px: 1 }}
                    >
                      {isExpanded ? 'Hide' : 'Show'} {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </CardComponent>

        {/* Reply form */}
        {replyTo === comment._id && (
          <Box sx={{ ml: 4, mt: 2 }}>
            <Stack spacing={2}>
              <CommentInput
                fullWidth
                placeholder="Write a reply..."
                multiline
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleSubmitReply(comment._id)}
                  disabled={!replyContent.trim() || loading}
                >
                  Reply
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Replies */}
        {hasReplies && (
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 1 }}>
              {comment.replies!.map(reply => renderComment(reply, true))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Comments ({comments.length})
      </Typography>

      {/* Comment form */}
      {showCommentForm && isAuthenticated && (
        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <CommentInput
              fullWidth
              placeholder="What are your thoughts?"
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Box>
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || loading}
              >
                Post Comment
              </Button>
            </Box>
          </Stack>
          <Divider sx={{ mt: 3 }} />
        </Box>
      )}

      {!isAuthenticated && showCommentForm && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Please log in to leave a comment.
          </Typography>
        </Box>
      )}

      {/* Comments list */}
      {commentsLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ p: 3 }}>
              <Stack direction="row" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : comments.length > 0 ? (
        <Stack spacing={2}>
          {comments.map(comment => renderComment(comment))}
        </Stack>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to share your thoughts!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentSystem;