export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static refreshInterval: number | null = null;

  // Get access token from localStorage
  static getToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Set access token in localStorage
  static setToken(token: string): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  // Get refresh token from localStorage
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Set refresh token in localStorage
  static setRefreshToken(token: string): void {
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  }

  // Clear all tokens
  static clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.stopTokenRefreshInterval();
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if we can't parse
    }
  }

  // Get token payload without verification
  static getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }

  // Check if current token is valid
  static isValidToken(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Refresh access token using refresh token
  static async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          this.setToken(data.accessToken);
          return data.accessToken;
        }
      }
      
      // If refresh fails, clear tokens
      this.clearTokens();
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return null;
    }
  }

  // Setup automatic token refresh
  static setupTokenRefreshInterval(): void {
    // Clear existing interval if any
    this.stopTokenRefreshInterval();

    // Set up new interval to check token every 5 minutes
    this.refreshInterval = window.setInterval(async () => {
      const token = this.getToken();
      if (token) {
        const payload = this.getTokenPayload(token);
        if (payload) {
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = payload.exp - currentTime;
          
          // Refresh token if it expires within 10 minutes
          if (timeUntilExpiry < 600) {
            console.log('Token expiring soon, attempting refresh...');
            const newToken = await this.refreshAccessToken();
            if (!newToken) {
              console.log('Token refresh failed, user will need to login again');
              // Could dispatch logout event here
              window.dispatchEvent(new CustomEvent('tokenExpired'));
            }
          }
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  // Stop token refresh interval
  static stopTokenRefreshInterval(): void {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Get authorization header
  static getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  // Get user info from token
  static getUserFromToken(): any {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      return null;
    }
    
    const payload = this.getTokenPayload(token);
    return payload ? {
      id: payload.id,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat
    } : null;
  }
}