import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { UserRole } from '../types/enums';
import { TokenManager } from '../utils/tokenManager';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage.tsx'));
const LoginForm = lazy(() => import('../components/auth/LoginForm.tsx'));
const SignupForm = lazy(() => import('../components/auth/SignupForm.tsx'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage.tsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.tsx'));
const ArticlePage = lazy(() => import('../pages/ArticlePage.tsx'));
const AuthorsPage = lazy(() => import('../pages/AuthorsPage.tsx'));
const AboutPage = lazy(() => import('../pages/AboutPage.tsx'));
const WritePage = lazy(() => import('../pages/WritePage.tsx'));
const UserDashboard = lazy(() => import('../pages/UserDashboard.tsx'));
const UserProfile = lazy(() => import('../pages/UserProfile.tsx'));

// Loading component for lazy loaded pages
const PageLoader = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8fbf8'
    }}
  >
    <CircularProgress />
  </Box>
);

// Route configuration type
export interface RouteConfig {
  id: string;
  path: string;
  component: React.ComponentType<any>;
  title: string;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  isPublic?: boolean;
  showInNav?: boolean;
  icon?: React.ReactNode;
  meta?: {
    description?: string;
    keywords?: string[];
  };
}

// Route configurations
export const routes: RouteConfig[] = [
  {
    id: 'home',
    path: '/',
    component: HomePage,
    title: 'Home',
    isPublic: true,
    showInNav: true,
    meta: {
      description: 'Welcome to BlogSpace - Where Stories Find Their Voice',
      keywords: ['blog', 'writing', 'stories', 'articles'],
    },
  },
  {
    id: 'login',
    path: '/login',
    component: LoginForm,
    title: 'Login',
    isPublic: true,
    showInNav: false,
    meta: {
      description: 'Login to your BlogSpace account',
    },
  },
  {
    id: 'signup',
    path: '/signup',
    component: SignupForm,
    title: 'Sign Up',
    isPublic: true,
    showInNav: false,
    meta: {
      description: 'Create a new BlogSpace account',
    },
  },
  {
    id: 'categories',
    path: '/categories',
    component: CategoriesPage,
    title: 'Categories',
    isPublic: true,
    showInNav: true,
    meta: {
      description: 'Explore blog categories',
      keywords: ['categories', 'topics', 'subjects'],
    },
  },
  {
    id: 'authors',
    path: '/authors',
    component: AuthorsPage,
    title: 'Authors',
    isPublic: true,
    showInNav: true,
    meta: {
      description: 'Discover talented writers',
      keywords: ['authors', 'writers', 'bloggers'],
    },
  },
  {
    id: 'about',
    path: '/about',
    component: AboutPage,
    title: 'About',
    isPublic: true,
    showInNav: true,
    meta: {
      description: 'Learn more about BlogSpace',
    },
  },
  {
    id: 'article',
    path: '/article/:id?',
    component: ArticlePage,
    title: 'Article',
    isPublic: true,
    showInNav: false,
    meta: {
      description: 'Read article',
    },
  },
  {
    id: 'write',
    path: '/write',
    component: WritePage,
    title: 'Write',
    requiresAuth: true,
    allowedRoles: [UserRole.AUTHOR, UserRole.ADMIN],
    showInNav: true,
    meta: {
      description: 'Create a new blog post',
    },
  },
  {
    id: 'admin',
    path: '/admin',
    component: AdminDashboard,
    title: 'Admin Dashboard',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
    showInNav: false,
    meta: {
      description: 'Admin dashboard',
    },
  },
  {
    id: 'user-dashboard',
    path: '/dashboard',
    component: UserDashboard,
    title: 'Dashboard',
    requiresAuth: true,
    allowedRoles: [UserRole.AUTHOR, UserRole.READER],
    showInNav: false,
    meta: {
      description: 'User dashboard',
    },
  },
  {
    id: 'user-profile',
    path: '/profile',
    component: UserProfile,
    title: 'Profile',
    requiresAuth: true,
    allowedRoles: [UserRole.AUTHOR, UserRole.READER, UserRole.ADMIN],
    showInNav: false,
    meta: {
      description: 'User profile settings',
    },
  },
];

// Route helper functions
export const getRouteById = (id: string): RouteConfig | undefined => {
  return routes.find(route => route.id === id);
};

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find(route => {
    // Handle dynamic routes (e.g., /article/:id)
    const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const getPublicRoutes = (): RouteConfig[] => {
  return routes.filter(route => route.isPublic);
};

export const getAuthenticatedRoutes = (userRole?: UserRole): RouteConfig[] => {
  return routes.filter(route => {
    if (!route.requiresAuth) return true;
    if (!userRole) return false;
    if (!route.allowedRoles || route.allowedRoles.length === 0) return true;
    return route.allowedRoles.includes(userRole);
  });
};

export const getNavigationRoutes = (userRole?: UserRole): RouteConfig[] => {
  const accessibleRoutes = userRole ? getAuthenticatedRoutes(userRole) : getPublicRoutes();
  return accessibleRoutes.filter(route => route.showInNav);
};

// Dynamic route component with lazy loading
export const DynamicRoute: React.FC<{
  routeId: string;
  routeProps?: any;
}> = ({ routeId, routeProps }) => {
  const route = getRouteById(routeId);
  
  if (!route) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <h2>404 - Page Not Found</h2>
      </Box>
    );
  }
  
  const Component = route.component;
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Component {...routeProps} />
    </Suspense>
  );
};

// Route guard component for protected routes
export const RouteGuard: React.FC<{
  route: RouteConfig;
  userRole?: UserRole;
  isAuthenticated: boolean;
  children: React.ReactNode;
  onRedirect: (path: string) => void;
}> = ({ route, userRole, isAuthenticated, children, onRedirect }) => {
  const [isValidating, setIsValidating] = React.useState(false);
  
  React.useEffect(() => {
    const validateAccess = async () => {
      if (route.requiresAuth) {
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Check if there's a valid token that might restore the session
          const hasValidToken = TokenManager.isValidToken();
          if (!hasValidToken) {
            onRedirect('/login');
            return;
          } else {
            // Token exists but user context might not be loaded yet
            setIsValidating(true);
            // Give a moment for the context to load the user from token
            setTimeout(() => setIsValidating(false), 1000);
            return;
          }
        }
        
        // Check role-based access
        if (route.allowedRoles && userRole && !route.allowedRoles.includes(userRole)) {
          // Redirect based on user role
          if (userRole === UserRole.ADMIN) {
            onRedirect('/admin');
          } else if (userRole === UserRole.AUTHOR || userRole === UserRole.READER) {
            onRedirect('/dashboard');
          } else {
            onRedirect('/');
          }
          return;
        }
      }
    };
    
    validateAccess();
  }, [route, userRole, isAuthenticated, onRedirect]);
  
  // Show loading while validating token
  if (isValidating) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Check access
  if (route.requiresAuth && !isAuthenticated) {
    return null;
  }
  
  if (route.allowedRoles && userRole && !route.allowedRoles.includes(userRole)) {
    return null;
  }
  
  return <>{children}</>;
};

// Navigation configuration
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: NavigationItem[];
}

export const getNavigationItems = (userRole?: UserRole): NavigationItem[] => {
  const navRoutes = getNavigationRoutes(userRole);
  
  return navRoutes.map(route => ({
    id: route.id,
    label: route.title,
    path: route.path,
    icon: route.icon,
  }));
};

// Breadcrumb generation
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const generateBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];
  
  const currentRoute = getRouteByPath(currentPath);
  if (currentRoute && currentRoute.id !== 'home') {
    breadcrumbs.push({
      label: currentRoute.title,
      path: currentRoute.path,
    });
  }
  
  return breadcrumbs;
};
