import { apiClient } from './apiClient'
import { useAuthStore } from './authStore'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user?: {
    email: string
  }
}

export interface RegisterResponse {
  message: string
}

export interface AuthStatusResponse {
  isAuthenticated: boolean
  user?: {
    email: string
  }
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  // Email authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/email/login', credentials, { _skipAuth: true })
    
    // Update auth store with tokens
    const { setAuth } = useAuthStore.getState()
    setAuth(response.accessToken, response.refreshToken, response.user)
    
    // Update apiClient token
    apiClient.setAuthToken(response.accessToken)
    
    return response
  },

  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/email/register', credentials, { _skipAuth: true })
  },

  // Check authentication status
  async checkAuthStatus(): Promise<AuthStatusResponse> {
    return apiClient.get<AuthStatusResponse>('/auth/status', { _skipAuth: true })
  },

  // Refresh tokens
  async refresh({ refreshToken }: RefreshRequest): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken }, { _skipAuth: true })
  },

  // Logout
  async logout(): Promise<{ message: string }> {
    try {
      await apiClient.post<{ message: string }>('/auth/logout')
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Always clear local state
      const { logout } = useAuthStore.getState()
      logout()
      apiClient.setAuthToken(null)
    }
    
    return { message: 'Logged out successfully' }
  },

  // Wallet authentication
  async getNonce(address: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/nonce', { address }, { _skipAuth: true })
  },

  async authenticateWallet(address: string, signature: string, message: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/evm', { 
      address, 
      signature, 
      message 
    }, { _skipAuth: true })
    
    // Update auth store with tokens
    const { setAuth } = useAuthStore.getState()
    setAuth(response.accessToken, response.refreshToken, response.user)
    
    // Update apiClient token
    apiClient.setAuthToken(response.accessToken)
    
    return response
  }
} 