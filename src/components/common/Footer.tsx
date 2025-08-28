import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Link,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(6, 8),
  marginTop: 'auto'
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pacifico, cursive',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2)
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[300],
  textDecoration: 'none',
  fontSize: '0.875rem',
  '&:hover': {
    color: theme.palette.common.white
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: '1.125rem',
  fontWeight: 500,
  marginBottom: theme.spacing(2)
}));

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Stack direction="row" spacing={8} justifyContent="space-between">
        <Box sx={{ maxWidth: 300 }}>
          <Logo>BlogSpace</Logo>
          <Typography variant="body2" color="grey.300" sx={{ mb: 3, lineHeight: 1.6 }}>
            A platform where stories and ideas find their voice.
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: 'grey.300' }}>
              <TwitterIcon />
            </IconButton>
            <IconButton sx={{ color: 'grey.300' }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: 'grey.300' }}>
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Box>

        <Stack spacing={2}>
          <SectionTitle>Explore</SectionTitle>
          <FooterLink href="#">Latest Posts</FooterLink>
          <FooterLink href="#">Popular Posts</FooterLink>
          <FooterLink href="#">Categories</FooterLink>
          <FooterLink href="#">Authors</FooterLink>
        </Stack>

        <Stack spacing={2}>
          <SectionTitle>Community</SectionTitle>
          <FooterLink href="#">Write for Us</FooterLink>
          <FooterLink href="#">Guidelines</FooterLink>
          <FooterLink href="#">Newsletter</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </Stack>

        <Stack spacing={2}>
          <SectionTitle>Support</SectionTitle>
          <FooterLink href="#">Help Center</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Cookie Policy</FooterLink>
        </Stack>
      </Stack>

      <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" color="grey.300" textAlign="center">
          © BlogSpace. All rights reserved.
        </Typography>
      </Box>
    </FooterContainer>
  );
};

export default Footer;