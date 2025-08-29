import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { PostCategory, UserRole, PostStatus } from '../types/enums';
import ApiService from '../services/api.service';
import { AlertService } from '../utils/alerts';
import { TokenManager } from '../utils/tokenManager';
import ErrorHandler, { RetryHandler } from '../utils/errorHandler';

// Types for our data structures
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  isVerified?: boolean;
}

export interface Author {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  articlesCount?: number;
  followersCount?: number;
  postsCount?: number;
}

export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  videoUrl?: string;
  category?: PostCategory;
  categories?: string[];
  author: Author | string;
  tags?: string[];
  status?: PostStatus;
  likes?: string[] | number;
  views?: number;
  isFeatured?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: number;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  postCount?: number;
  followerCount?: number;
  trending?: boolean;
  popular?: boolean;
  isNew?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  activeUsers: number;
  postsGrowth: number;
  usersGrowth: number;
  commentsGrowth: number;
  activeUsersGrowth: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  posts: Post[];
  categories: Category[];
  featuredAuthors: Author[];
  dashboardStats: DashboardStats | null;
  userStats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    viewsGrowth?: number;
  } | null;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  // Authentication actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;

  // Data fetching actions
  fetchPosts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tag?: string;
    author?: string;
    featured?: boolean;
  }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAuthors: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  
  // Post actions
  createPost: (postData: {
    title: string;
    content: string;
    excerpt?: string;
    categories?: string[];
    tags?: string[];
    status?: string;
    isFeatured?: boolean;
    featuredImage?: File;
    video?: File;
  }) => Promise<boolean>;
  updatePost: (id: string, postData: any) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  likePost: (id: string) => Promise<void>;
  
  // Category actions
  createCategory: (categoryData: { name: string; description?: string }) => Promise<boolean>;
  updateCategory: (id: string, updates: { name?: string; description?: string }) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Comment actions
  fetchComments: (postId: string) => Promise<void>;
  createComment: (postId: string, content: string, parentId?: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  
  // Notification actions
  markNotificationAsRead: (id: number) => void;
  clearNotifications: () => void;
  
  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    posts: [],
    categories: [],
    featuredAuthors: [],
    dashboardStats: null,
    userStats: null,
    notifications: [],
    loading: false,
    error: null,
  });

  // Check for existing auth token on mount
  useEffect(() => {
    const token = TokenManager.getToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      // Token exists and is valid - restore user session
      const userInfo = TokenManager.getUserFromToken();
      if (userInfo) {
        const user: User = {
          id: userInfo.id,
          name: 'Restored User', // Would need to fetch from API in real app
          email: 'user@restored.session',
          role: userInfo.role === 'admin' ? UserRole.ADMIN : 
                userInfo.role === 'user' ? UserRole.AUTHOR : UserRole.READER,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
        };
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
        }));
      }
    } else {
      // No valid token, ensure user is logged out
      TokenManager.clearTokens();
      setState(prev => ({ 
        ...prev, 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      }));
    }
    
    // Listen for token expiration events
    const handleTokenExpired = () => {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
      AlertService.warning('Session Expired', 'Please log in again to continue.');
    };
    
    // Listen for auth errors
    const handleAuthError = () => {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    };
    
    window.addEventListener('tokenExpired', handleTokenExpired);
    window.addEventListener('authError', handleAuthError);
    
    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
      window.removeEventListener('authError', handleAuthError);
    };
  }, []);

  // Authentication methods
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await ApiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, accessToken } = response.data;
        
        // Store the JWT token
        if (accessToken) {
          TokenManager.setToken(accessToken);
        }
        
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role === 'admin' ? UserRole.ADMIN : 
                userData.role === 'user' ? UserRole.AUTHOR : UserRole.READER,
          avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          bio: userData.bio,
          socialLinks: userData.socialLinks,
          isVerified: userData.isVerified,
        };
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
        
        // Show success toast
        AlertService.toast.success(`Welcome back, ${user.name}!`);
        
        return true;
      } else {
        AlertService.error('Login Failed', response.error || 'Invalid credentials');
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Invalid credentials' 
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      AlertService.error('Login Error', errorMessage);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    // Show confirmation dialog
    const result = await AlertService.confirm(
      'Sign Out',
      'Are you sure you want to sign out?',
      'Yes, Sign Out',
      'Cancel'
    );
    
    if (!result.isConfirmed) {
      return;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Call logout API
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
    
    // Clear the auth tokens
    TokenManager.clearTokens();
    
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      loading: false,
    }));
    
    // Show success message
    AlertService.toast.success('Successfully signed out!');
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await ApiService.signup(name, email, password);
      
      if (response.success && response.data) {
        const { user: userData, accessToken } = response.data;
        
        // Store the JWT token
        if (accessToken) {
          localStorage.setItem('authToken', accessToken);
        }
        
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role === 'admin' ? UserRole.ADMIN : 
                userData.role === 'user' ? UserRole.AUTHOR : UserRole.READER,
          avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          bio: userData.bio,
          socialLinks: userData.socialLinks,
          isVerified: userData.isVerified,
        };
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
        
        // Show success message
        AlertService.toast.success(`Welcome to BlogSpace, ${user.name}!`);
        
        return true;
      } else {
        AlertService.error('Signup Failed', response.error || 'Signup failed');
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Signup failed' 
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      AlertService.error('Signup Error', errorMessage);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return false;
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ApiService.updateUser(userData);

      if (response.success && response.data) {
        const updatedUser: User = {
          ...state.user!,
          ...response.data,
          role: response.data.role === 'admin' ? UserRole.ADMIN :
                response.data.role === 'user' ? UserRole.AUTHOR : UserRole.READER,
        };

        setState(prev => ({
          ...prev,
          user: updatedUser,
          loading: false,
          error: null,
        }));

        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Update failed'
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return false;
    }
  }, [state.user]);

  // Calculate user stats from posts
  const calculateUserStats = useCallback(() => {
    if (!state.user || !state.posts) return null;

    const userPosts = state.posts.filter(post =>
      typeof post.author === 'object' ? post.author.id === state.user?.id : post.author === state.user?.id
    );

    return {
      totalPosts: userPosts.length,
      publishedPosts: userPosts.filter(p => p.status === 'published').length,
      draftPosts: userPosts.filter(p => p.status === 'draft').length,
      totalViews: userPosts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalLikes: userPosts.reduce((sum, post) => sum + (typeof post.likes === 'number' ? post.likes : 0), 0),
      totalComments: userPosts.reduce((sum, post) => sum + (post.comments || 0), 0),
      viewsGrowth: 0, // This would come from analytics
    };
  }, [state.user, state.posts]);

  // Update user stats when posts change
  useEffect(() => {
    const newUserStats = calculateUserStats();
    if (newUserStats && JSON.stringify(newUserStats) !== JSON.stringify(state.userStats)) {
      setState(prev => ({ ...prev, userStats: newUserStats }));
    }
  }, [calculateUserStats, state.userStats]);

  // Data fetching methods
  const fetchPosts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tag?: string;
    author?: string;
    featured?: boolean;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await RetryHandler.withRetry(() => ApiService.getPosts(params), 'fetchPosts');
      
      if (response.success && response.data) {
        // Transform backend posts to frontend format
        const transformedPosts = response.data.items.map((post: any) => ({
          id: post._id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          featuredImage: post.featuredImage,
          videoUrl: post.videoUrl,
          category: post.categories?.[0] || PostCategory.TECHNOLOGY,
          author: typeof post.author === 'object' ? {
            id: post.author._id,
            name: post.author.name,
            title: 'Author',
            avatar: post.author.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          } : {
            id: post.author,
            name: 'Unknown Author',
            title: 'Author',
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          },
          tags: post.tags || [],
          status: post.status,
          likes: Array.isArray(post.likes) ? post.likes.length : 0,
          views: post.views || 0,
          isFeatured: post.isFeatured || false,
          publishedAt: new Date(post.createdAt || Date.now()),
          comments: 0, // Will be fetched separately if needed
        }));
        
        setState(prev => ({ 
          ...prev, 
          posts: transformedPosts,
          loading: false 
        }));
      } else {
        const error = response.error || 'Failed to fetch posts';
        console.error('Failed to fetch posts:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error 
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
      console.error('Error in fetchPosts:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await ApiService.getCategories();
      
      if (response.success && response.data) {
        // Transform backend categories to frontend format
        const transformedCategories = response.data.map((category: any) => ({
          id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          postCount: Math.floor(Math.random() * 50) + 10, // Mock for now
          followerCount: Math.floor(Math.random() * 2000) + 100, // Mock for now
          trending: Math.random() > 0.7,
          popular: Math.random() > 0.6,
          isNew: Math.random() > 0.8,
        }));
        
        setState(prev => ({ 
          ...prev, 
          categories: transformedCategories,
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Failed to fetch categories' 
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const fetchAuthors = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // For now, generate mock authors since we don't have a specific authors endpoint
      // In a real app, this would fetch from an authors endpoint
      const mockAuthors = generateMockAuthors();
      setState(prev => ({ 
        ...prev, 
        featuredAuthors: mockAuthors,
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch authors';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // For now, generate mock stats since we don't have a dashboard endpoint
      const mockStats = generateMockDashboardStats();
      setState(prev => ({ 
        ...prev, 
        dashboardStats: mockStats,
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  // Post actions
  const createPost = useCallback(async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    categories?: string[];
    tags?: string[];
    status?: string;
    isFeatured?: boolean;
    featuredImage?: File;
    video?: File;
  }): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    
    // Show loading alert
    AlertService.loading('Creating Post', 'Publishing your post...');
    
    try {
      // Check if user is authenticated
      if (!state.isAuthenticated || !state.user) {
        AlertService.close();
        AlertService.error('Authentication Required', 'Please log in to create posts.');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }

      // Check if token exists
      const token = TokenManager.getToken();
      if (!token) {
        AlertService.close();
        AlertService.error('Authentication Required', 'Please log in again to create posts.');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }

      console.log('Creating post with data:', postData);
      console.log('User authenticated:', state.isAuthenticated);
      console.log('Token exists:', !!token);

      const formData = ApiService.createPostFormData(postData);
      const response = await ApiService.createPost(formData);
      
      if (response.success && response.data) {
        // Transform and add the new post to state
        const newPost = {
          id: response.data._id,
          title: response.data.title,
          slug: response.data.slug,
          excerpt: response.data.excerpt || '',
          content: response.data.content,
          featuredImage: response.data.featuredImage,
          videoUrl: response.data.videoUrl,
          category: response.data.categories?.[0] || PostCategory.TECHNOLOGY,
          author: typeof response.data.author === 'object' ? {
            id: response.data.author._id,
            name: response.data.author.name,
            title: 'Author',
            avatar: response.data.author.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          } : {
            id: response.data.author,
            name: state.user?.name || 'Unknown Author',
            title: 'Author',
            avatar: state.user?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
          },
          tags: response.data.tags || [],
          status: response.data.status,
          likes: [],
          views: 0,
          isFeatured: response.data.isFeatured || false,
          publishedAt: new Date(response.data.createdAt || Date.now()),
          comments: 0,
        };
        
        setState(prev => ({
          ...prev,
          posts: [newPost, ...prev.posts],
          loading: false,
        }));
        
        // Close loading and show success
        AlertService.close();
        AlertService.success('Post Published!', 'Your post has been published successfully.');
        
        return true;
      } else {
        AlertService.close();
        AlertService.error('Failed to Create Post', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      AlertService.close();
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      AlertService.error('Error Creating Post', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, [state.user]);

  const updatePost = useCallback(async (id: string, postData: any): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const formData = ApiService.createPostFormData(postData);
      const response = await ApiService.updatePost(id, formData);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          posts: prev.posts.map(post => 
            post.id === id ? { 
              ...post, 
              title: response.data.title,
              excerpt: response.data.excerpt,
              content: response.data.content,
              featuredImage: response.data.featuredImage,
              videoUrl: response.data.videoUrl,
              tags: response.data.tags,
              status: response.data.status,
              isFeatured: response.data.isFeatured,
            } : post
          ),
          loading: false,
        }));
        
        AlertService.toast.success('Post updated successfully!');
        return true;
      } else {
        AlertService.error('Failed to Update Post', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      AlertService.error('Error Updating Post', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    // Show confirmation dialog
    const result = await AlertService.confirm(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!result.isConfirmed) {
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await ApiService.deletePost(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          posts: prev.posts.filter(post => post.id !== id),
          loading: false,
        }));
        
        AlertService.toast.success('Post deleted successfully!');
        return true;
      } else {
        AlertService.error('Failed to Delete Post', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      AlertService.error('Error Deleting Post', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  const likePost = useCallback(async (id: string) => {
    try {
      const response = await ApiService.toggleLike(id);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          posts: prev.posts.map(post => 
            post.id === id ? { 
              ...post, 
              likes: response.data?.likes || (Array.isArray(post.likes) ? post.likes.length : 0)
            } : post
          ),
        }));
        
        AlertService.toast.success(response.data.liked ? 'Post liked!' : 'Post unliked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, []);

  // Category actions
  const createCategory = useCallback(async (categoryData: { name: string; description?: string }): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await ApiService.createCategory(categoryData);
      
      if (response.success && response.data) {
        const newCategory = {
          id: response.data._id,
          name: response.data.name,
          slug: response.data.slug,
          description: response.data.description || '',
          postCount: 0,
          followerCount: 0,
          trending: false,
          popular: false,
          isNew: true,
        };
        
        setState(prev => ({
          ...prev,
          categories: [...prev.categories, newCategory],
          loading: false,
        }));
        
        AlertService.toast.success('Category created successfully!');
        return true;
      } else {
        AlertService.error('Failed to Create Category', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      AlertService.error('Error Creating Category', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: { name?: string; description?: string }): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await ApiService.updateCategory(id, updates);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === id ? { 
              ...cat, 
              name: response.data.name,
              description: response.data.description,
            } : cat
          ),
          loading: false,
        }));
        
        AlertService.toast.success('Category updated successfully!');
        return true;
      } else {
        AlertService.error('Failed to Update Category', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      AlertService.error('Error Updating Category', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    const result = await AlertService.confirm(
      'Delete Category',
      'Are you sure you want to delete this category?',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!result.isConfirmed) {
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await ApiService.deleteCategory(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          categories: prev.categories.filter(cat => cat.id !== id),
          loading: false,
        }));
        
        AlertService.toast.success('Category deleted successfully!');
        return true;
      } else {
        AlertService.error('Failed to Delete Category', response.error || 'Unknown error occurred');
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      AlertService.error('Error Deleting Category', errorMessage);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  // Comment actions
  const fetchComments = useCallback(async (postId: string) => {
    try {
      const response = await ApiService.getComments(postId);
      // For now, just log the comments since we don't store them in global state
      // In a real app, you might want to add comments to the global state
      console.log('Fetched comments:', response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  const createComment = useCallback(async (postId: string, content: string, parentId?: string): Promise<boolean> => {
    try {
      const response = await ApiService.createComment(postId, content, parentId);
      
      if (response.success) {
        AlertService.toast.success('Comment added successfully!');
        return true;
      } else {
        AlertService.error('Failed to Add Comment', response.error || 'Unknown error occurred');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      AlertService.error('Error Adding Comment', errorMessage);
      return false;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    const result = await AlertService.confirm(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!result.isConfirmed) {
      return false;
    }
    
    try {
      const response = await ApiService.deleteComment(commentId);
      
      if (response.success) {
        AlertService.toast.success('Comment deleted successfully!');
        return true;
      } else {
        AlertService.error('Failed to Delete Comment', response.error || 'Unknown error occurred');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      AlertService.error('Error Deleting Comment', errorMessage);
      return false;
    }
  }, []);

  // Notification actions
  const markNotificationAsRead = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
    }));
  }, []);

  // UI state methods
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const value: AppContextType = {
    ...state,
    login,
    logout,
    signup,
    updateUser,
    fetchPosts,
    fetchCategories,
    fetchAuthors,
    fetchDashboardStats,
    createPost,
    updatePost,
    deletePost,
    likePost,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchComments,
    createComment,
    deleteComment,
    markNotificationAsRead,
    clearNotifications,
    setLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Helper functions for mock data (keep for fallback scenarios)
function generateMockAuthors(): Author[] {
  const authors: Author[] = [];
  
  for (let i = 1; i <= 6; i++) {
    authors.push({
      id: `author-${i}`,
      name: getRandomAuthorName(),
      title: getRandomAuthorTitle(),
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      postsCount: Math.floor(Math.random() * 40) + 5,
      followersCount: Math.floor(Math.random() * 3000) + 200,
    });
  }
  
  return authors;
}

function generateMockDashboardStats(): DashboardStats {
  return {
    totalPosts: Math.floor(Math.random() * 500) + 100,
    totalUsers: Math.floor(Math.random() * 5000) + 1000,
    totalComments: Math.floor(Math.random() * 2000) + 500,
    activeUsers: Math.floor(Math.random() * 3000) + 500,
    postsGrowth: Math.floor(Math.random() * 20) + 5,
    usersGrowth: Math.floor(Math.random() * 15) + 3,
    commentsGrowth: Math.floor(Math.random() * 25) + 10,
    activeUsersGrowth: Math.floor(Math.random() * 10) + 2,
  };
}

// Helper functions for random data
function getRandomAuthorName(): string {
  const names = [
    'Emma Thompson', 'Marcus Rodriguez', 'Sarah Johnson', 'Michael Chen',
    'Alexandra Mitchell', 'David Park', 'Jessica Williams', 'Robert Lee',
    'Maria Garcia', 'James Wilson',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomAuthorTitle(): string {
  const titles = [
    'Tech Writer', 'Creative Writing Coach', 'Business Analyst', 'Design Expert',
    'Health Advocate', 'Lifestyle Blogger', 'Environmental Advocate', 'Content Creator',
    'Digital Strategist', 'Community Manager',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}
