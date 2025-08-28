import { PostCategory, UserRole, PostStatus } from '../types/enums';

// Data for global state store
export const mockStore = {
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@blogspace.com',
    role: UserRole.ADMIN as const,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  isAuthenticated: true,
  notifications: {
    count: 3
  }
};

// Data returned by API queries
export const mockQuery = {
  categories: [
    {
      id: 1,
      name: PostCategory.TECHNOLOGY as const,
      postCount: 42,
      followerCount: 1200,
      trending: true,
      description: 'Latest tech trends and innovations'
    },
    {
      id: 2, 
      name: PostCategory.LIFESTYLE as const,
      postCount: 38,
      followerCount: 890,
      popular: true,
      description: 'Discover tips for sustainable living, wellness, productivity, and creating a balanced life.'
    },
    {
      id: 3,
      name: PostCategory.CREATIVE_WRITING as const, 
      postCount: 29,
      followerCount: 654,
      description: 'Master the art of storytelling, poetry, fiction, and creative expression through words.'
    },
    {
      id: 4,
      name: PostCategory.BUSINESS as const,
      postCount: 25, 
      followerCount: 723
    },
    {
      id: 5,
      name: PostCategory.DESIGN as const,
      postCount: 18,
      followerCount: 445,
      description: 'UI/UX design principles, graphic design trends, and creative inspiration for visual storytellers.'
    },
    {
      id: 6,
      name: PostCategory.HEALTH_WELLNESS as const,
      postCount: 22,
      followerCount: 567,
      isNew: true
    }
  ],
  posts: [
    {
      id: 1,
      title: 'The Art of Storytelling: Crafting Compelling Narratives',
      excerpt: 'Learn the fundamental techniques that make stories memorable and engaging, from character development to plot structure and emotional resonance.',
      category: PostCategory.CREATIVE_WRITING as const,
      author: {
        id: 1,
        name: 'Emma Thompson',
        title: 'Creative Writing Coach',
        avatar: 'https://i.pravatar.cc/150?img=2',
        articlesCount: 18,
        followersCount: 2400
      },
      publishedAt: new Date('2024-03-09'),
      likes: 156,
      comments: 24,
      heroImage: '/images/storytelling-hero.jpg'
    }
  ],
  dashboardStats: {
    totalPosts: 156,
    totalUsers: 2897,
    totalComments: 1929,
    activeUsers: 1932,
    postsGrowth: 12,
    usersGrowth: 8,
    commentsGrowth: 15,
    activeUsersGrowth: 5
  },

  recentPosts: [
    {
      id: 1,
      title: 'The Art of Storytelling',
      category: 'Writing',
      author: {
        name: 'Emma Thompson',
        avatar: 'https://i.pravatar.cc/150?img=2'
      }
    },
    {
      id: 2,
      title: 'Digital Marketing Trends', 
      category: 'Business',
      author: {
        name: 'Mal Q.',
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    }
  ],
  recentUsers: [
    {
      id: 1,
      name: 'Alexandra Mitchell',
      email: 'alexandra.mitchell@email.com',
      role: UserRole.AUTHOR as const,
      joinedAt: new Date('2024-03-15'),
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    {
      id: 2,
      name: 'David Park',
      email: 'david.park@email.com', 
      role: UserRole.READER as const,
      joinedAt: new Date('2024-03-09'),
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ],
  featuredAuthors: [
    {
      id: 1,
      name: 'Marcus Rodriguez',
      title: 'Environmental Advocate',
      postsCount: 12,
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: 2,
      name: 'Emma Thompson',
      title: 'Creative Writing Coach',
      postsCount: 18,
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  initialRoute: '/',
  theme: 'light'
};