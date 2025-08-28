import { Post, Category, Author, User, DashboardStats } from '../contexts/AppContext';
import { PostCategory, UserRole, PostStatus } from '../types/enums';
import { AlertService } from '../utils/alerts';
import { TokenManager } from '../utils/tokenManager';
import ErrorHandler from '../utils/errorHandler';

// Base configuration for API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  uploadURL: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:4000/uploads',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Backend specific response types
interface BackendAuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
    socialLinks?: any;
    isVerified?: boolean;
  };
  accessToken: string;
}

interface BackendPostsResponse {
  items: any[];
  total: number;
  page: number;
  pages: number;
}

// Helper function to get auth token
function getAuthToken(): string | null {
  return TokenManager.getToken();
}

// Helper function to handle auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Generic request handler
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useFormData = false
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    // Default headers
    const headers: HeadersInit = useFormData
      ? { Authorization: `Bearer ${getAuthToken() || ''}` }
      : getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Request failed:', error);
    
    const errorMessage = ErrorHandler.handleApiError(error, `${options.method || 'GET'} ${endpoint}`);
    
    // Handle auth errors
    if ((error as any).status === 401) {
      await ErrorHandler.handleAuthError();
    } else {
      ErrorHandler.showNetworkError(errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Service class for API interactions
export class ApiService {
  // Authentication
  static async login(email: string, password: string): Promise<ApiResponse<BackendAuthResponse>> {
    return makeRequest<BackendAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async signup(name: string, email: string, password: string, role?: string): Promise<ApiResponse<BackendAuthResponse>> {
    return makeRequest<BackendAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: role || 'user' }),
    });
  }

  static async logout(): Promise<ApiResponse<{ message: string }>> {
    return makeRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return makeRequest<{ accessToken: string }>('/auth/refresh-token', {
      method: 'POST',
    });
  }

  // Posts
  static async getPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    tag?: string;
    author?: string;
    featured?: boolean;
  }): Promise<ApiResponse<BackendPostsResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    return makeRequest<BackendPostsResponse>(endpoint);
  }

  static async getPost(slug: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/posts/${slug}`);
  }

  static async createPost(postData: FormData): Promise<ApiResponse<any>> {
    return makeRequest<any>('/posts', {
      method: 'POST',
      body: postData,
    }, true); // Use form data
  }

  static async updatePost(id: string, updates: FormData): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/posts/${id}`, {
      method: 'PUT',
      body: updates,
    }, true); // Use form data
  }

  static async deletePost(id: string): Promise<ApiResponse<{ message: string }>> {
    return makeRequest<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  static async toggleLike(id: string): Promise<ApiResponse<{ likes: number; liked: boolean }>> {
    return makeRequest<{ likes: number; liked: boolean }>(`/posts/${id}/like`, {
      method: 'PATCH',
    });
  }

  // Categories
  static async getCategories(): Promise<ApiResponse<any[]>> {
    return makeRequest<any[]>('/categories');
  }

  static async getCategory(slug: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/categories/${slug}`);
  }

  static async createCategory(categoryData: { name: string; description?: string }): Promise<ApiResponse<any>> {
    return makeRequest<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  static async updateCategory(id: string, updates: { name?: string; description?: string }): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return makeRequest<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  static async getComments(postId: string, params?: {
    tree?: boolean;
    includePending?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/comments/post/${postId}?${queryString}` : `/comments/post/${postId}`;
    return makeRequest<any[]>(endpoint);
  }

  static async createComment(postId: string, content: string, parentId?: string): Promise<ApiResponse<any>> {
    return makeRequest<any>('/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content, parentId }),
    });
  }

  static async updateComment(commentId: string, content: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  static async deleteComment(commentId: string): Promise<ApiResponse<{ message: string }>> {
    return makeRequest<{ message: string }>(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  static async toggleLikeComment(commentId: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  static async approveComment(commentId: string): Promise<ApiResponse<any>> {
    return makeRequest<any>(`/comments/${commentId}/approve`, {
      method: 'PATCH',
    });
  }

  // File Upload
  static async uploadFile(file: File, type: 'image' | 'video' = 'image'): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append(type === 'image' ? 'featuredImage' : 'video', file);

    return makeRequest<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      body: formData,
    }, true);
  }

  // Helper method to create FormData for posts
  static createPostFormData(postData: {
    title: string;
    content: string;
    excerpt?: string;
    categories?: string[];
    tags?: string[];
    status?: string;
    isFeatured?: boolean;
    featuredImage?: File;
    video?: File;
  }): FormData {
    const formData = new FormData();
    
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    
    if (postData.excerpt) formData.append('excerpt', postData.excerpt);
    if (postData.categories) formData.append('categories', JSON.stringify(postData.categories));
    if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
    if (postData.status) formData.append('status', postData.status);
    if (postData.isFeatured !== undefined) formData.append('isFeatured', String(postData.isFeatured));
    
    if (postData.featuredImage) formData.append('featuredImage', postData.featuredImage);
    if (postData.video) formData.append('video', postData.video);
    
    return formData;
  }
}

// Export the API service as default
export default ApiService;
