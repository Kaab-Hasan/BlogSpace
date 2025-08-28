import { PostCategory, UserRole, PostStatus } from '../types/enums';

// Data for global state store
export const mockStore = {
  user: {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: UserRole.AUTHOR as const,
    avatar: 'https://i.pravatar.cc/150?img=8',
    articlesCount: 12,
    followersCount: 245
  },
  isAuthenticated: true,
  notifications: {
    count: 2
  }
};

// Data returned by API queries
export const mockQuery = {
  userStats: {
    totalPosts: 29,
    publishedPosts: 18,
    draftPosts: 6,
    totalViews: 1297,
    postsGrowth: 15,
    viewsGrowth: 22
  },
  userPosts: [
    {
      id: 1,
      title: 'The Art of Storytelling: Crafting Compelling Narratives',
      excerpt: 'Learn the fundamental techniques that make stories memorable and engaging, from character development to plot structure...',
      category: PostCategory.CREATIVE_WRITING as const,
      status: PostStatus.PUBLISHED as const,
      publishedAt: new Date('2024-03-09'),
      views: 342,
      comments: 18,
      likes: 45,
      readingTime: 8,
      heroImage: '/images/storytelling-hero.jpg'
    },
    {
      id: 2,
      title: 'Digital Marketing Trends for 2024',
      excerpt: 'Explore the latest digital marketing strategies and trends that will shape the industry in 2024...',
      category: PostCategory.BUSINESS as const,
      status: PostStatus.PUBLISHED as const,
      publishedAt: new Date('2024-03-05'),
      views: 256,
      comments: 12,
      likes: 32,
      readingTime: 6,
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Building Better User Experiences',
      excerpt: 'A comprehensive guide to UX design principles and best practices for modern web applications...',
      category: PostCategory.DESIGN as const,
      status: PostStatus.DRAFT as const,
      publishedAt: new Date('2024-03-01'),
      views: 0,
      comments: 0,
      likes: 0,
      readingTime: 10,
      heroImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop'
    }
  ],
  categories: [
    { id: 1, name: PostCategory.TECHNOLOGY as const, postCount: 5 },
    { id: 2, name: PostCategory.LIFESTYLE as const, postCount: 8 },
    { id: 3, name: PostCategory.CREATIVE_WRITING as const, postCount: 12 },
    { id: 4, name: PostCategory.BUSINESS as const, postCount: 3 },
    { id: 5, name: PostCategory.DESIGN as const, postCount: 1 }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  initialPage: 'overview',
  theme: 'light'
};