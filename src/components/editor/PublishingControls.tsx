import React from 'react';
import {
  Box,
  Button,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.common.white,
  borderTop: '1px solid #e5e7eb',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.10), 0px 10px 15px rgba(0, 0, 0, 0.10)',
  padding: theme.spacing(2, 3),
  zIndex: 1000
}));

const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  border: '1px solid #d1d5db',
  color: '#4b5563',
  backgroundColor: theme.palette.common.white,
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 400,
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af'
  }
}));

const PreviewButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  border: '1px solid #2e7d32',
  color: '#2e7d32',
  backgroundColor: theme.palette.common.white,
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 400,
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#f1f8e9'
  }
}));

const PublishButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#2e7d32',
  color: theme.palette.common.white,
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 400,
  padding: theme.spacing(1.5, 3),
  '&:hover': {
    backgroundColor: '#1b5e20'
  }
}));

interface PublishingControlsProps {
  onSaveDraft?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  isPublishing?: boolean;
  isSaving?: boolean;
}

const PublishingControls: React.FC<PublishingControlsProps> = ({
  onSaveDraft,
  onPreview,
  onPublish,
  isPublishing = false,
  isSaving = false
}) => {
  return (
    <ControlsContainer>
      <Stack direction="row" justifyContent="center" spacing={3}>
        <SaveButton
          onClick={onSaveDraft}
          disabled={isSaving}
          startIcon={<span>💾</span>}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </SaveButton>
        
        <PreviewButton
          onClick={onPreview}
          startIcon={<span>👁</span>}
        >
          Preview
        </PreviewButton>
        
        <PublishButton
          onClick={onPublish}
          disabled={isPublishing}
          startIcon={<span>📤</span>}
        >
          {isPublishing ? 'Publishing...' : 'Publish Article'}
        </PublishButton>
      </Stack>
    </ControlsContainer>
  );
};

export default PublishingControls;