import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { handleGlobalError, ErrorBoundaryState } from '../../utils/errorHandler';

const ErrorContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
  padding: '2rem',
});

const ErrorCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: 16,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    handleGlobalError(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} reset={this.handleReset} />;
      }

      return (
        <ErrorContainer>
          <ErrorCard>
            <CardContent>
              <Typography variant="h5" color="error" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {import.meta.env.DEV 
                  ? this.state.error?.message || 'An unexpected error occurred'
                  : 'We encountered an unexpected error. Please try refreshing the page.'
                }
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </Box>
              {import.meta.env.DEV && this.state.error && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
                  <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                    {this.state.error.stack}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;