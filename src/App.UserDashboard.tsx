import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import theme from './theme/theme';
import UserDashboard from './pages/UserDashboard';
import BlogPostEditor from './pages/BlogPostEditor';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

type PageType = 'dashboard' | 'write' | 'article' | 'profile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const handleNavigation = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <UserDashboard onNavigate={handleNavigation} />;
      case 'write':
        return <BlogPostEditor onNavigate={handleNavigation} />;
      case 'article':
        return <UserDashboard onNavigate={handleNavigation} />;
      case 'profile':
        return <UserDashboard onNavigate={handleNavigation} />;
      default:
        return <UserDashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {renderCurrentPage()}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;