import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 400,
  height: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&.draft': {
    backgroundColor: '#ca8a04',
    color: theme.palette.common.white
  }
}));

export default StatusChip;