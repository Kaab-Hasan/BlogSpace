import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

// Generic hook for handling async operations with loading and error states
export function useAsyncOperation<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  deps: React.DependencyList = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  return { execute, loading, error };
}

// Hook for fetching posts with optional filters
export function usePosts(initialFilter?: string) {
  const { posts, fetchPosts, loading: contextLoading } = useApp();
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      setLocalLoading(true);
      try {
        // Parse filter if needed (for now just fetch all)
        await fetchPosts();
      } finally {
        setLocalLoading(false);
      }
    };
    
    loadPosts();
  }, [filter, fetchPosts]);

  const refetch = useCallback(async () => {
    setLocalLoading(true);
    try {
      await fetchPosts();
    } finally {
      setLocalLoading(false);
    }
  }, [filter, fetchPosts]);

  return {
    posts,
    loading: contextLoading || localLoading,
    filter,
    setFilter,
    refetch,
  };
}

// Hook for fetching categories
export function useCategories() {
  const { categories, fetchCategories, loading: contextLoading } = useApp();
  const [localLoading, setLocalLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded && categories.length === 0) {
      const loadCategories = async () => {
        setLocalLoading(true);
        await fetchCategories();
        setLocalLoading(false);
        setHasLoaded(true);
      };
      
      loadCategories();
    }
  }, [fetchCategories, categories.length, hasLoaded]);

  const refetch = useCallback(async () => {
    setLocalLoading(true);
    await fetchCategories();
    setLocalLoading(false);
  }, [fetchCategories]);

  return {
    categories,
    loading: contextLoading || localLoading,
    refetch,
  };
}

// Hook for fetching authors
export function useAuthors() {
  const { featuredAuthors, fetchAuthors, loading: contextLoading } = useApp();
  const [localLoading, setLocalLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded && featuredAuthors.length === 0) {
      const loadAuthors = async () => {
        setLocalLoading(true);
        await fetchAuthors();
        setLocalLoading(false);
        setHasLoaded(true);
      };
      
      loadAuthors();
    }
  }, [fetchAuthors, featuredAuthors.length, hasLoaded]);

  const refetch = useCallback(async () => {
    setLocalLoading(true);
    await fetchAuthors();
    setLocalLoading(false);
  }, [fetchAuthors]);

  return {
    authors: featuredAuthors,
    loading: contextLoading || localLoading,
    refetch,
  };
}

// Hook for dashboard statistics
export function useDashboardStats() {
  const { dashboardStats, fetchDashboardStats, loading: contextLoading } = useApp();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!dashboardStats) {
      const loadStats = async () => {
        setLocalLoading(true);
        await fetchDashboardStats();
        setLocalLoading(false);
      };
      
      loadStats();
    }
  }, [fetchDashboardStats, dashboardStats]);

  const refetch = useCallback(async () => {
    setLocalLoading(true);
    await fetchDashboardStats();
    setLocalLoading(false);
  }, [fetchDashboardStats]);

  return {
    stats: dashboardStats,
    loading: contextLoading || localLoading,
    refetch,
  };
}

// Hook for authentication
export function useAuth() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    loading,
    error,
  } = useApp();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    loading,
    error,
  };
}

// Hook for notifications
export function useNotifications() {
  const {
    notifications,
    markNotificationAsRead,
    clearNotifications,
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead: markNotificationAsRead,
    clearAll: clearNotifications,
  };
}

// Hook for post actions
export function usePostActions() {
  const {
    createPost,
    updatePost,
    deletePost,
    likePost,
  } = useApp();

  return {
    create: createPost,
    update: updatePost,
    delete: deletePost,
    like: likePost,
  };
}

// Hook for follow actions (stub for now)
export function useFollowActions() {
  // These would be implemented when backend supports follow functionality
  const followCategory = async (categoryId: string) => {
    console.log('Follow category:', categoryId);
    return true;
  };
  
  const followAuthor = async (authorId: string) => {
    console.log('Follow author:', authorId);
    return true;
  };

  return {
    followCategory,
    followAuthor,
  };
}

// Hook for search functionality
export function useSearch<T>(
  items: T[],
  searchKeys: (keyof T)[],
  initialQuery: string = ''
) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>(items);

  useEffect(() => {
    if (!query.trim()) {
      setResults(items);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      })
    );

    setResults(filtered);
  }, [query, items, searchKeys]);

  return {
    query,
    setQuery,
    results,
  };
}

// Hook for pagination
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// Hook for sorting
export function useSort<T>(
  items: T[],
  initialSortKey: keyof T | null = null,
  initialOrder: 'asc' | 'desc' = 'asc'
) {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialOrder);

  const sortedItems = [...items].sort((a, b) => {
    if (!sortKey) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === bValue) return 0;

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  return {
    sortedItems,
    sortKey,
    sortOrder,
    toggleSort,
  };
}
