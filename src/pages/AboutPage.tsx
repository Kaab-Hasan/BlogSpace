import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Breadcrumbs,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PageContainer = styled(Box)({
  backgroundColor: '#f8fbf8',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 8),
  flex: 1
}));

const ContentCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
  marginBottom: theme.spacing(3),
  position: 'relative'
}));

const GradientBar = styled(Box)(({ theme }) => ({
  height: 4,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  borderRadius: '0 0 16px 16px',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
}));

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <PageContainer>
      <Header onNavigate={onNavigate} currentPage="about" />
      
      <ContentSection>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            underline="hover" 
            color="text.secondary" 
            onClick={() => onNavigate?.('home')}
            sx={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Typography color="primary.main">About</Typography>
        </Breadcrumbs>

        <Typography variant="h1" color="primary.main" sx={{ mb: 6 }}>
          About BlogSpace
        </Typography>

        <Stack spacing={4}>
          <ContentCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary.main" sx={{ mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                BlogSpace is a platform where stories and ideas find their voice. We believe in the power of 
                written word to inspire, educate, and connect people from all walks of life. Our mission is to 
                provide a space where passionate writers and curious readers can come together to share knowledge, 
                experiences, and creativity.
              </Typography>
            </CardContent>
            <GradientBar />
          </ContentCard>

          <ContentCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary.main" sx={{ mb: 3 }}>
                What We Offer
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • <strong>Diverse Content:</strong> From technology and lifestyle to creative writing and business insights, 
                  we cover a wide range of topics to satisfy every reader's curiosity.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • <strong>Quality Writing:</strong> Our community of talented authors brings you well-researched, 
                  engaging, and thought-provoking content.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • <strong>Interactive Community:</strong> Connect with authors, share your thoughts through comments, 
                  and discover new perspectives.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • <strong>Easy Publishing:</strong> Whether you're a seasoned writer or just starting out, 
                  our platform makes it easy to share your stories with the world.
                </Typography>
              </Stack>
            </CardContent>
            <GradientBar />
          </ContentCard>

          <ContentCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="primary.main" sx={{ mb: 3 }}>
                Join Our Community
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Ready to be part of something bigger? Whether you want to share your expertise, learn something new, 
                or simply enjoy great content, BlogSpace welcomes you. Create your account today and start your 
                journey with us.
              </Typography>
            </CardContent>
            <GradientBar />
          </ContentCard>
        </Stack>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
};

export default AboutPage;