import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const ActionButton = styled(IconButton)({
  padding: 4,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
});

export default ActionButton;