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
    return api.post('/auth/nonce', { address })
  },

  authenticateWallet: async (address: string, signature: string, message: string) => {
    return api.post('/auth/evm', { address, signature, message })
  },

  // Logout
  logout: async () => {
    return api.post('/auth/logout', {})
  }
} 