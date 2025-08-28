import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DocumentIcon from '../icons/DocumentIcon';
import CheckmarkIcon from '../icons/CheckmarkIcon';
import EditIcon from '../icons/EditIcon';
import EyeIcon from '../icons/EyeIcon';
import UploadIcon from '../icons/UploadIcon';
import DownloadIcon from '../icons/DownloadIcon';
import GridIcon from '../icons/GridIcon';
import { formatViewCount } from '../../utils/userFormatters';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  backgroundColor: theme.palette.common.white,
  borderRight: `1px solid ${theme.palette.divider}`,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  height: '100vh',
  overflow: 'auto',
  padding: theme.spacing(3)
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: '#f9fafb',
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
  border: 'none'
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 400,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(0.5)
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: '#4b5563'
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3)
}));

const ActionButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  color: '#374151',
  fontSize: '15.5px',
  fontWeight: 400,
  padding: theme.spacing(1, 0),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));

const FilterButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  color: '#4b5563',
  fontSize: '16px',
  fontWeight: 400,
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'transparent'
  },
  '&.active': {
    color: '#98cf98'
  }
}));

interface UserSidebarProps {
  userStats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
  };
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  onQuickAction?: (action: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  userStats,
  selectedFilter = 'all',
  onFilterChange,
  onQuickAction
}) => {
  const statsData = [
    {
      number: userStats.totalPosts,
      label: 'Total Posts',
      icon: <DocumentIcon width={12} height={13} color="#2e5a2e" />
    },
    {
      number: userStats.publishedPosts,
      label: 'Published',
      icon: <CheckmarkIcon width={11} height={8} color="#16a34a" />
    },
    {
      number: userStats.draftPosts,
      label: 'Drafts',
      icon: <EditIcon width={13} height={13} color="#ca8a04" />
    },
    {
      number: formatViewCount(userStats.totalViews),
      label: 'Total Views',
      icon: <EyeIcon width={14} height={12} color="#2563eb" />
    }
  ];

  const quickActions = [
    { id: 'import', label: 'Import Content', icon: <UploadIcon width={11} height={11} color="#2e5a2e" /> },
    { id: 'export', label: 'Export Posts', icon: <DownloadIcon width={11} height={11} color="#2e5a2e" /> },
    { id: 'bulk', label: 'Bulk Actions', icon: <GridIcon width={12} height={12} color="#2e5a2e" /> }
  ];

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'published', label: 'Published Only' },
    { id: 'drafts', label: 'Drafts Only' },
    { id: 'recent', label: 'Recent Posts' }
  ];

  return (
    <SidebarContainer>
      <Typography variant="h6" sx={{ color: 'primary.main', mb: 3 }}>
        Quick Stats
      </Typography>

      <Stack spacing={2}>
        {statsData.map((stat, index) => (
          <StatsCard key={index}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </Box>
                <IconContainer>
                  {stat.icon}
                </IconContainer>
              </Stack>
            </CardContent>
          </StatsCard>
        ))}
      </Stack>

      <SectionTitle>Quick Actions</SectionTitle>
      <Stack>
        {quickActions.map((action) => (
          <ActionButton
            key={action.id}
            startIcon={action.icon}
            onClick={() => onQuickAction?.(action.id)}
          >
            {action.label}
          </ActionButton>
        ))}
      </Stack>

      <SectionTitle>Filter Posts</SectionTitle>
      <Stack>
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            className={selectedFilter === filter.id ? 'active' : ''}
            onClick={() => onFilterChange?.(filter.id)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </Stack>
    </SidebarContainer>
  );
};

export default UserSidebar;