import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { AppProvider } from './contexts/AppContext';
import { useAuth } from './hooks/useData';
import theme from './theme/theme';
import { DynamicRoute, RouteGuard, getRouteById, routes } from './router/routes';
import { UserRole } from './types/enums';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

type PageType = 'home' | 'login' | 'signup' | 'categories' | 'admin' | 'article' | 'authors' | 'about' | 'write' | 'user-dashboard';

// Main app component wrapped with providers
const AppContent: React.FC = () => {
  const [currentRouteId, setCurrentRouteId] = useState<string>('home');
  const { login, signup, logout, user, isAuthenticated } = useAuth();

  const handleNavigation = (page: string) => {
    // Map old page names to route IDs if needed
    const routeId = page === 'user-dashboard' ? 'user-dashboard' : page;
    setCurrentRouteId(routeId);
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const success = await login(credentials.email, credentials.password);
    if (success) {
      // Navigate based on user role dynamically
      setTimeout(() => {
        if (user?.role === UserRole.ADMIN) {
          setCurrentRouteId('admin');
        } else {
          setCurrentRouteId('user-dashboard');
        }
      }, 100);
    }
  };

  const handleSignup = async (data: { username: string; email: string; password: string }) => {
    const success = await signup(data.username, data.email, data.password);
    if (success) {
      // Navigate to user dashboard after successful signup
      setTimeout(() => {
        setCurrentRouteId('user-dashboard');
      }, 100);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    // Simulate social login
    const success = await login(`${provider}@user.com`, 'social-login');
    if (success) {
      setCurrentRouteId('home');
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentRouteId('home');
  };

  // Get current route configuration
  const currentRoute = getRouteById(currentRouteId);
  
  // Prepare props for the current route component
  const getRouteProps = () => {
    const baseProps = { 
      onNavigate: handleNavigation,
      onLogout: handleLogout
    };
    
    switch (currentRouteId) {
      case 'login':
        return {
          ...baseProps,
          onLogin: handleLogin,
          onSocialLogin: handleSocialLogin,
          onNavigateToSignup: () => setCurrentRouteId('signup'),
          onNavigateBack: () => setCurrentRouteId('home'),
        };
      case 'signup':
        return {
          ...baseProps,
          onSignup: handleSignup,
          onNavigateBack: () => setCurrentRouteId('home'),
        };
      default:
        return baseProps;
    }
  };

  if (!currentRoute) {
    return <DynamicRoute routeId="home" routeProps={{ onNavigate: handleNavigation }} />;
  }

  return (
    <RouteGuard
      route={currentRoute}
      userRole={user?.role}
      isAuthenticated={isAuthenticated}
      onRedirect={(path) => {
        const redirectRoute = routes.find(r => r.path === path);
        if (redirectRoute) {
          setCurrentRouteId(redirectRoute.id);
        }
      }}
    >
      <DynamicRoute 
        routeId={currentRouteId} 
        routeProps={getRouteProps()}
      />
    </RouteGuard>
  );
};

const App: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
