import { api } from '../lib/api'

interface AuthResponse {
  accessToken: string
  refreshToken: string
  message?: string
}

// Auth requests
export const authService = {
  // Wallet authentication
  getNonce: async (address: string) => {
    return api.post<{ message: string }>('/auth/nonce', { address })
  },

  authenticateWallet: async (address: string, signature: string, message: string) => {
    return api.post<AuthResponse>('/auth/evm', { address, signature, message })
  },

  // Google authentication
  initiateGoogleAuth: async () => {
    return api.get<{ url: string }>('/auth/google')
  },

  handleGoogleCallback: async (code: string) => {
    return api.get<AuthResponse>(`/auth/google/callback?code=${code}`)
  },

  // Logout
  logout: async () => {
    return api.post('/auth/logout', {})
  }
} 