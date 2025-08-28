import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.BlogSpace'
import ErrorBoundary from './components/common/ErrorBoundary'
import { TokenManager } from './utils/tokenManager'
import '../index.css'
import './styles/sweetalert.css'

// Initialize token refresh system
TokenManager.setupTokenRefreshInterval();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)