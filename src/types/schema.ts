import { PostCategory, UserRole, PostStatus } from './enums';

// Props types (data passed to components)
export interface User {
  id: string; // MongoDB ObjectId as string
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
  title?: string;
  articlesCount?: number;
  followersCount?: number;
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Post {
  _id?: string; // MongoDB ObjectId
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  videoUrl?: string;
  category?: PostCategory;
  categories?: string[]; // Array of category IDs
  author: User | string; // Can be populated User object or ID
  tags?: string[];
  status?: PostStatus;
  likes?: string[]; // Array of user IDs who liked
  views?: number;
  isFeatured?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // Computed fields
  comments?: number; // Count of comments
}

export interface Category {
  _id?: string; // MongoDB ObjectId
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

export interface Comment {
  _id?: string; // MongoDB ObjectId
  id?: string;
  content: string;
  author: User | string; // Can be populated User object or ID
  postId: string;
  parentId?: string; // For nested comments
  likes?: string[]; // Array of user IDs who liked
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  replies?: Comment[];
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

// Store types (global state data)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: {
    count: number;
  };
}

export interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  searchQuery: string;
}

// Query types (API response data)
export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentPosts: Post[];
  recentUsers: User[];
  featuredAuthors: User[];
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}