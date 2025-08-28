import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e5a2e',
      light: '#98cf98',
      dark: '#1e3a1e',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#98cf98',
      light: '#c8e6c9',
      dark: '#66bb6a',
      contrastText: '#2e5a2e'
    },
    success: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d'
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb'
    },
    warning: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c'
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af'
    },
    background: {
      default: '#f8fbf8',
      paper: '#ffffff'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    divider: '#e5e7eb'
  },
  typography: {
    fontFamily: '"Segoe UI Symbol", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'Pacifico, cursive',
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)',
    '0px 4px 6px rgba(0, 0, 0, 0.10), 0px 10px 15px rgba(0, 0, 0, 0.10)',
    '0px 10px 15px rgba(0, 0, 0, 0.10), 0px 20px 25px rgba(0, 0, 0, 0.10)',
    '0px 20px 25px rgba(0, 0, 0, 0.10), 0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)',
    '0px 25px 50px rgba(0, 0, 0, 0.25)'
  ]
});

export default theme;