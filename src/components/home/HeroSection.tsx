import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroContainer = styled(Box)({
  background: 'linear-gradient(112.62deg, rgba(46,90,46,0.8) 0%, rgba(152,207,152,0.6) 100%)',
  backgroundImage: 'url(/images/storytelling-hero.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0 80px',
  position: 'relative'
});

const HeroContent = styled(Box)({
  maxWidth: '600px',
  color: 'white'
});

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing(4),
  fontWeight: 400
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  marginRight: theme.spacing(2)
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.light
  }
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

interface HeroSectionProps {
  onStartWriting?: () => void;
  onExplorePosts?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onStartWriting,
  onExplorePosts
}) => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>
          Join our community of passionate writers and readers. Create,
          publish, and discover amazing content that inspires and
          informs.
        </HeroTitle>
        
        <Stack direction="row" spacing={2}>
          <PrimaryButton onClick={onStartWriting}>
            Start Writing
          </PrimaryButton>
          <SecondaryButton variant="outlined" onClick={onExplorePosts}>
            Explore Posts
          </SecondaryButton>
        </Stack>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;