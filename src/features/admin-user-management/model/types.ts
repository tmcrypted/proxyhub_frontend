export interface User {
  id: number
  role: 'USER' | 'ADMIN'
  name?: string
  email?: string
  evmAddress?: string
  authProvider: 'EMAIL' | 'GOOGLE' | 'WALLET'
  isHaveNowpaymentsAccount: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    Proxy: number
    Order: number
  }
}

export interface UpdateUserData {
  role?: 'USER' | 'ADMIN'
  name?: string
  email?: string
  evmAddress?: string
  authProvider?: 'EMAIL' | 'GOOGLE' | 'WALLET'
  isHaveNowpaymentsAccount?: boolean
  isVerified?: boolean
} 