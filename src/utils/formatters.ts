import { PostCategory, UserRole } from '../types/enums';

export const formatPostCount = (count: number): string => {
  return `${count} posts`;
};

export const formatFollowerCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k followers`;
  }
  return `${count} followers`;
};

export const formatGrowthPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage}% from last month`;
};

export const formatCategoryName = (category: PostCategory | string): string => {
  // Handle both enum values and string names
  const categoryNames = {
    [PostCategory.TECHNOLOGY]: 'Technology',
    [PostCategory.LIFESTYLE]: 'Lifestyle',
    [PostCategory.CREATIVE_WRITING]: 'Creative Writing',
    [PostCategory.BUSINESS]: 'Business',
    [PostCategory.DESIGN]: 'Design',
    [PostCategory.HEALTH_WELLNESS]: 'Health & Wellness',
    [PostCategory.EDUCATION]: 'Education',
    [PostCategory.PHOTOGRAPHY]: 'Photography',
    [PostCategory.FOOD_COOKING]: 'Food & Cooking'
  };

  // If it's already a formatted string, return it
  if (typeof category === 'string') {
    // Check if it's an enum value
    if (categoryNames[category as PostCategory]) {
      return categoryNames[category as PostCategory];
    }
    // Otherwise, capitalize the first letter and return as-is
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  return categoryNames[category] || 'Unknown';
};

export const formatUserRole = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.AUTHOR]: 'Author', 
    [UserRole.READER]: 'Reader'
  };
  return roleNames[role];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatArticleCount = (count: number): string => {
  return `${count} articles`;
};