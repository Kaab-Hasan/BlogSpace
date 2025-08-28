import { AlertService } from './alerts';

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

export class ErrorHandler {
  static handleApiError(error: any, context?: string): string {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    // Network errors
    if (!navigator.onLine) {
      return 'You appear to be offline. Please check your internet connection.';
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 400:
          return error.message || 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication failed. Please log in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return error.message || 'This resource already exists.';
        case 422:
          return error.message || 'Invalid data provided.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return error.message || `Server error (${error.status}). Please try again.`;
      }
    }
    
    // Generic error message
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  static async handleAuthError(): Promise<void> {
    // Clear any stored auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Show error message
    await AlertService.warning(
      'Authentication Required',
      'Your session has expired. Please log in again.'
    );
    
    // Redirect to login (could also dispatch an event)
    window.dispatchEvent(new CustomEvent('authError'));
  }

  static showNetworkError(message?: string): void {
    AlertService.toast.error(
      message || 'Network error. Please check your connection.'
    );
  }

  static showValidationError(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).join('\n');
    AlertService.error('Validation Error', errorMessages);
  }

  static createErrorFromResponse(response: Response, data?: any): Error {
    const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).statusText = response.statusText;
    (error as any).data = data;
    return error;
  }
}

export class RetryHandler {
  static async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = DEFAULT_RETRY_CONFIG.maxAttempts,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain error types
        if (this.shouldNotRetry(error)) {
          throw lastError;
        }
        
        // If this was the last attempt, throw the error
        if (attempt === maxAttempts) {
          throw lastError;
        }
        
        // Calculate delay for next attempt
        const delay = Math.min(
          finalConfig.baseDelayMs * Math.pow(finalConfig.backoffMultiplier, attempt - 1),
          finalConfig.maxDelayMs
        );
        
        console.warn(
          `Operation failed on attempt ${attempt}/${maxAttempts}. Retrying in ${delay}ms...`,
          lastError
        );
        
        // Wait before retrying
        await this.delay(delay);
      }
    }
    
    throw lastError!;
  }

  private static shouldNotRetry(error: any): boolean {
    // Don't retry on client errors (4xx) except for 408, 429
    if (error.status >= 400 && error.status < 500) {
      return error.status !== 408 && error.status !== 429;
    }
    
    // Don't retry on authentication errors
    if (error.status === 401 || error.status === 403) {
      return true;
    }
    
    // Don't retry on validation errors
    if (error.status === 422) {
      return true;
    }
    
    return false;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    context?: string,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    try {
      return await this.retry(operation, config?.maxAttempts, config);
    } catch (error) {
      const errorMessage = ErrorHandler.handleApiError(error, context);
      
      // Handle specific error types
      if ((error as any).status === 401) {
        await ErrorHandler.handleAuthError();
      } else {
        ErrorHandler.showNetworkError(errorMessage);
      }
      
      throw error;
    }
  }
}

export function handleGlobalError(error: unknown, info?: any): void {
  const message = ErrorHandler.handleApiError(error, "Global");
  console.error("🌐 Global Error:", message, info || "");
  // Show a user-facing alert (optional)
  AlertService.error("Unexpected Error", message);
}


export default ErrorHandler;