import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

export default StyledCard;