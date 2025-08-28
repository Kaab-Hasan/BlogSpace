import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Stack } from '@mui/material';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import theme from './theme/theme';
import PostCard from './components/user/PostCard';
import { mockQuery } from './data/UserDashboardMockData';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  const handleEdit = (postId: number) => {
    console.log('Edit post:', postId);
  };

  const handleView = (postId: number) => {
    console.log('View post:', postId);
  };

  const handleClick = (postId: number) => {
    console.log('Click post:', postId);
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Post Cards Preview
          </Typography>
          <Stack spacing={2}>
            {mockQuery.userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onView={handleView}
                onClick={handleClick}
              />
            ))}
          </Stack>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;