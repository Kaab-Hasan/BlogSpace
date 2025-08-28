import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGradientBar = styled(Box)(({ theme }) => ({
  height: 4,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  borderRadius: '0 0 16px 16px',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
}));

const GradientBar: React.FC = () => {
  return <StyledGradientBar />;
};

export default GradientBar;