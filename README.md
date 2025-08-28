# BlogSpace

A modern blog platform built with React, TypeScript, and Material-UI.

## Features

- 🏠 **Homepage** with hero section and featured posts
- 🔐 **Authentication** system with login/signup
- 📝 **Content Creation** with rich text editor and image upload
- 📊 **Admin Dashboard** with analytics and content management
- 👤 **User Dashboard** with personal blog management
- 🏷️ **Categories** with search and filtering
- 👥 **Author Profiles** and following system
- 💬 **Comments System** for engagement
- 📱 **Responsive Design** for all devices
- 🎨 **Modern UI** with Material Design principles

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Default Login Credentials

- **Admin Access**: `admin@blogspace.com` (any password) - Redirects to Admin Dashboard
- **Regular User**: Any other email (any password) - Redirects to User Dashboard

### Navigation

- **Home**: Landing page with featured content
- **Categories**: Browse and filter blog categories
- **Authors**: Discover featured writers
- **About**: Learn about BlogSpace
- **Write**: Create new blog posts (when logged in)
- **Admin Dashboard**: Content management for administrators
- **User Dashboard**: Personal blog management for regular users

### User Dashboard Features

- **Personal Statistics**: View your total posts, published articles, drafts, and views
- **Post Management**: Create, edit, and manage your blog posts
- **Content Filtering**: Filter posts by status (all, published, drafts, recent)
- **Search Functionality**: Search through your posts
- **Quick Actions**: Import content, export posts, bulk operations

### Blog Post Editor Features

- **Rich Text Editor**: Full-featured editor with formatting options
- **Image Upload**: Drag and drop image upload with preview
- **Category Selection**: Choose from available categories
- **Tag Management**: Add and manage post tags
- **Reading Time Estimation**: Automatic calculation based on content
- **Auto-save**: Automatic saving of drafts
- **Publishing Controls**: Save draft, preview, and publish options

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion (CSS-in-JS) with MUI sx prop
- **Build Tool**: Vite
- **Icons**: Material-UI Icons + Custom SVG Icons
- **Fonts**: Pacifico (Google Fonts) + Segoe UI Symbol

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── categories/     # Category-related components
│   ├── common/         # Shared components (Header, Footer)
│   ├── editor/         # Blog post editor components
│   ├── home/           # Homepage components
│   ├── icons/          # Custom SVG icon components
│   └── user/           # User dashboard components
├── pages/              # Page components
│   ├── AdminDashboard.tsx    # Admin management interface
│   ├── BlogPostEditor.tsx    # Blog post creation/editing
│   ├── UserDashboard.tsx     # User personal dashboard
│   └── ...             # Other pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Mock data
└── theme/              # MUI theme configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.