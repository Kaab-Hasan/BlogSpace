import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SignupVisibilityIcon from '../icons/SignupVisibilityIcon';
import SignupBackArrowIcon from '../icons/SignupBackArrowIcon';
import AlertService from '../../utils/alerts';

const PageContainer = styled(Box)({
  backgroundColor: '#f9fafb',
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
  color: '#2e7d32'
});

const BackButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#2e7d32'
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  position: 'relative'
});

const FormSection = styled(Box)({
  width: '60%',
  padding: '40px 175px 40px 175px',
  backgroundColor: 'transparent'
});

const BackgroundSection = styled(Box)({
  width: '40%',
  background: 'linear-gradient(135deg, rgba(240,253,244,1) 0%, rgba(220,252,231,1) 100%)',
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    '& fieldset': {
      border: 'none'
    },
    '&:hover': {
      borderColor: '#e5e7eb'
    },
    '&.Mui-focused': {
      borderColor: '#e5e7eb'
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

const SignUpButton = styled(Button)({
  backgroundColor: '#2e7d32',
  color: '#ffffff',
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '16px',
  fontFamily: 'Segoe UI Symbol',
  fontWeight: 400,
  padding: '12px 36px',
  alignSelf: 'flex-start',
  '&:hover': {
    backgroundColor: '#1b5e20'
  }
});

interface SignupFormProps {
  onSignup?: (data: { username: string; email: string; password: string }) => void;
  onNavigateBack?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onNavigateBack
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and privacy policy';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSignup?.({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
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
        <Logo>logo</Logo>
        <BackButton onClick={onNavigateBack}>
          <SignupBackArrowIcon width={9} height={9} color="#2e7d32" />
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1, 
              fontSize: '16px',
              fontFamily: 'Segoe UI Symbol',
              fontWeight: 400,
              color: '#2e7d32'
            }}
          >
            Back to Home
          </Typography>
        </BackButton>
      </Header>

      <MainContent>
        <FormSection>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: '30px',
              fontFamily: 'Segoe UI Symbol',
              fontWeight: 400,
              lineHeight: '36px',
              color: '#111827',
              mb: 4
            }}
          >
            Create Your Account
          </Typography>

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
                  Username
                </Typography>
                <StyledTextField
                  fullWidth
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  error={!!errors.username}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '12px',
                    fontFamily: 'Segoe UI Symbol',
                    fontWeight: 400,
                    color: '#6b7280',
                    mt: 0.5
                  }}
                >
                  This will be your public display name
                </Typography>
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
                  Email Address
                </Typography>
                <StyledTextField
                  fullWidth
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ p: 0 }}
                        >
                          <SignupVisibilityIcon width={13} height={12} color="#9ca3af" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
                  Confirm Password
                </Typography>
                <StyledTextField
                  fullWidth
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                />
              </Stack>

              <Stack spacing={1} sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      sx={{
                        p: 0,
                        mr: 1,
                        '& .MuiSvgIcon-root': {
                          fontSize: 16,
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          width: 16,
                          height: 16
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
                      I agree to the{' '}
                      <Link 
                        href="#" 
                        sx={{ 
                          color: '#2e7d32',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontFamily: 'Segoe UI Symbol',
                          fontWeight: 400
                        }}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        href="#" 
                        sx={{ 
                          color: '#2e7d32',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontFamily: 'Segoe UI Symbol',
                          fontWeight: 400
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.terms && (
                  <Typography variant="caption" color="error">
                    {errors.terms}
                  </Typography>
                )}
              </Stack>

              <SignUpButton type="submit" sx={{ mt: 4 }}>
                SignUp
              </SignUpButton>
            </Stack>
          </Box>
        </FormSection>

        <BackgroundSection />
      </MainContent>
    </PageContainer>
  );
};

export default SignupForm;