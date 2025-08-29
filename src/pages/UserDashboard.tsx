import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserHeader from '../components/user/UserHeader';
import UserSidebar from '../components/user/UserSidebar';
import PostsList from '../components/user/PostsList';
import { useApp } from '../contexts/AppContext';

const DashboardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#f8fdf8'
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1
});

interface UserDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate, onLogout }) => {
  const { 
    user, 
    posts, 
    categories, 
    dashboardStats, 
    loading, 
    fetchPosts, 
    fetchCategories, 
    fetchDashboardStats,
    deletePost,
    logout 
  } = useApp();
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch data on mount
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts({ author: user?.id });
    }
    if (categories.length === 0) {
      fetchCategories();
    }
    if (!dashboardStats) {
      fetchDashboardStats();
    }
  }, [user, posts, categories, dashboardStats, fetchPosts, fetchCategories, fetchDashboardStats]);

  // Filter user's posts
  const userPosts = posts.filter(post => {
    if (typeof post.author === 'object') {
      return post.author.id === user?.id;
    }
    return post.author === user?.id;
  });

  // Filter posts based on selected filter
  const filteredPosts = userPosts.filter(post => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'published') return post.status === 'published';
    if (selectedFilter === 'draft') return post.status === 'draft';
    return true;
  });

  // Calculate user stats
  const userStats = {
    totalPosts: userPosts.length,
    publishedPosts: userPosts.filter(p => p.status === 'published').length,
    draftPosts: userPosts.filter(p => p.status === 'draft').length,
    totalViews: userPosts.reduce((sum, post) => sum + (post.views || 0), 0),
    totalLikes: userPosts.reduce((sum, post) => sum + (typeof post.likes === 'number' ? post.likes : 0), 0),
    totalComments: userPosts.reduce((sum, post) => sum + (post.comments || 0), 0),
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    onNavigate?.(page);
  };

  const handleNewPost = () => {
    onNavigate?.('write');
  };

  const handleProfileClick = () => {
    onNavigate?.('profile');
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleEditPost = async (postId: string) => {
    console.log('Edit post:', postId);
    // In a real app, you might want to pass the post data to the editor
    onNavigate?.('write');
  };

  const handleViewPost = (postId: string) => {
    console.log('View post:', postId);
    onNavigate?.('article');
  };

  const handlePostClick = (postId: string) => {
    console.log('Post clicked:', postId);
    onNavigate?.('article');
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);
    if (success) {
      // Refresh posts after deletion
      fetchPosts({ author: user?.id });
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  return (
    <DashboardContainer>
      {user && (
        <UserHeader
          user={{
            name: user.name,
            avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`
          }}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onNewPost={handleNewPost}
          onProfileClick={handleProfileClick}
        />
      )}
      
      <MainContent>
        <UserSidebar
          userStats={userStats}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onQuickAction={handleQuickAction}
        />
        
        <PostsList
          posts={filteredPosts.map(post => ({
            id: parseInt(post.id || '0'),
            title: post.title,
            excerpt: post.excerpt || '',
            category: typeof post.category === 'string' ? post.category : 'General',
            status: post.status || 'draft',
            publishedAt: post.publishedAt || new Date(),
            views: post.views || 0,
            comments: post.comments || 0,
            readingTime: Math.ceil((post.content?.length || 0) / 200), // Estimate reading time
            heroImage: post.featuredImage || ''
          }))}
          categories={categories.map(cat => ({
            id: parseInt(cat.id || '0'),
            name: cat.name,
            postCount: cat.postCount || 0
          }))}
          selectedFilter={selectedFilter}
          onEditPost={(postId: number) => handleEditPost(postId.toString())}
          onViewPost={(postId: number) => handleViewPost(postId.toString())}
          onPostClick={(postId: number) => handlePostClick(postId.toString())}
        />
      </MainContent>
    </DashboardContainer>
  );
};

export default UserDashboard;