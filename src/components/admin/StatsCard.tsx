import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatGrowthPercentage } from '../../utils/formatters';
import GradientBar from '../common/GradientBar';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const GrowthText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: '0.85rem'
}));

interface StatsCardProps {
  title: string;
  value: number;
  growth: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  growth,
  icon
}) => {
  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 500 }}>
                {value.toLocaleString()}
              </Typography>
            </Box>
            <IconContainer>
              {icon}
            </IconContainer>
          </Stack>
          
          <GrowthText>
            {formatGrowthPercentage(growth)}
          </GrowthText>
        </Stack>
      </CardContent>
      <GradientBar />
    </StyledCard>
  );
};

export default StatsCard;