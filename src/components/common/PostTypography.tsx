import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PostTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 400,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  lineHeight: 1.2
}));

export const PostExcerpt = styled(Typography)(({ theme }) => ({
  fontSize: '13.89px',
  fontWeight: 400,
  color: '#4b5563',
  lineHeight: 1.4,
  marginBottom: theme.spacing(1)
}));

export const MetaText = styled(Typography)({
  fontSize: '13.23px',
  fontWeight: 400,
  color: '#6b7280'
});