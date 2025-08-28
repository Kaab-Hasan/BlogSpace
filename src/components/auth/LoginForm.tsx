import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleIcon from '../icons/GoogleIcon';
import FacebookIcon from '../icons/FacebookIcon';
import VisibilityIcon from '../icons/VisibilityIcon';
import BackArrowIcon from '../icons/BackArrowIcon';
import AlertService from '../../utils/alerts';

const PageContainer = styled(Box)({
  backgroundColor: '#e8f3e8',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(2.5, 3),
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const Logo = styled(Typography)({
  fontFamily: 'Pacifico, cursive',
  fontSize: '24px',
  fontWeight: 400,
  lineHeight: '32px',
  color: '#2e5a2e'
});

const BackButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#2e5a2e'
});

const MainCard = styled(Card)({
  width: 448,
  margin: '87px auto 0',
  borderRadius: 16,
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.10), 0px 10px 15px rgba(0, 0, 0, 0.10)',
  backgroundColor: '#ffffff'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    border: '1px solid #d1d5db',
    '& fieldset': {
      border: 'none'
    },
    '&:hover': {
      borderColor: '#d1d5db'
    },
    '&.Mui-focused': {
      borderColor: '#d1d5db'
    }
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'Segoe UI Symbol',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1
    }
  }
});

const SignInButton = styled(Button)({
  backgroundColor: '#2e5a2e',
  color: '#ffffff',
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '16px',
  fontFamily: 'Segoe UI Symbol',
  fontWeight: 400,
  padding: '12px 24px',
  width: '100%',
  '&:hover': {
    backgroundColor: '#1e3a1e'
  }
});

const SocialButton = styled(Button)({
  borderRadius: 8,
  border: '1px solid #d1d5db',
  textTransform: 'none',
  color: '#374151',
  fontSize: '14px',
  fontFamily: 'Segoe UI Symbol',
  fontWeight: 400,
  padding: '12px 16px',
  backgroundColor: '#ffffff',
  '&:hover': {
    backgroundColor: '#f9fafb'
  }
});

const HorizontalDivider = styled(Box)({
  position: 'relative',
  margin: '24px 0',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#d1d5db'
  }
});

const DividerText = styled(Typography)({
  position: 'relative',
  backgroundColor: '#ffffff',
  padding: '0 12px',
  fontSize: '13.56px',
  fontFamily: 'Segoe UI Symbol',
  fontWeight: 400,
  color: '#6b7280',
  textAlign: 'center'
});

interface LoginFormProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onSocialLogin?: (provider: 'google' | 'facebook') => void;
  onNavigateToSignup?: () => void;
  onNavigateBack?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSocialLogin,
  onNavigateToSignup,
  onNavigateBack
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onLogin?.({ email, password });
    } else {
      // Show validation error immediately as toast
      const firstError = Object.values(newErrors)[0];
      // Use setTimeout with 0 to ensure it's in the next tick for instant display
      setTimeout(() => {
        AlertService.toast.warning(firstError);
      }, 0);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Logo>BlogSpace</Logo>
        <BackButton onClick={onNavigateBack}>
          <BackArrowIcon width={11} height={10} color="#2e5a2e" />
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1, 
              fontSize: '16px',
              fontFamily: 'Segoe UI Symbol',
              fontWeight: 400,
              color: '#2e5a2e'
            }}
          >
            Back to Home
          </Typography>
        </BackButton>
      </Header>

      <MainCard>
        <CardContent sx={{ p: '32px' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '14px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#374151',
                    mb: 1
                  }}
                >
                  Email Address
                </Typography>
                <StyledTextField
                  fullWidth
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '14px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#374151',
                    mb: 1
                  }}
                >
                  Password
                </Typography>
                <StyledTextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ p: 0 }}
                        >
                          <VisibilityIcon width={14} height={12} color="#9ca3af" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        p: 0,
                        mr: 1,
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          width: 20,
                          height: 20
                        }
                      }}
                    />
                  }
                  label={
                    <Typography 
                      sx={{ 
                        fontSize: '14px',
                        fontFamily: 'Segoe UI Symbol',
                        fontWeight: 400,
                        color: '#4b5563'
                      }}
                    >
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  href="#"
                  sx={{ 
                    fontSize: '14px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#98cf98',
                    textDecoration: 'none'
                  }}
                >
                  Forgot Password?
                </Link>
              </Stack>

              <SignInButton type="submit" sx={{ mt: 3 }}>
                Sign In
              </SignInButton>

              <HorizontalDivider>
                <DividerText>or continue with</DividerText>
              </HorizontalDivider>

              <Stack direction="row" spacing={2}>
                <SocialButton
                  fullWidth
                  startIcon={<GoogleIcon width={13} height={13} color="#ef4444" />}
                  onClick={() => onSocialLogin?.('google')}
                >
                  Google
                </SocialButton>
                <SocialButton
                  fullWidth
                  startIcon={<FacebookIcon width={7} height={13} color="#2563eb" />}
                  onClick={() => onSocialLogin?.('facebook')}
                >
                  Facebook
                </SocialButton>
              </Stack>

              <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mt: 3 }}>
                <Typography 
                  sx={{ 
                    fontSize: '14px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#4b5563'
                  }}
                >
                  Don't have an account?{' '}
                </Typography>
                <Link
                  component="button"
                  type="button"
                  onClick={onNavigateToSignup}
                  sx={{ 
                    fontSize: '14px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#98cf98',
                    textDecoration: 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Create Account
                </Link>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </MainCard>
    </PageContainer>
  );
};

export default LoginForm;