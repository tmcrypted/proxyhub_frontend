import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

// Types
interface User {
  id?: number
  email?: string
  address?: string
  role?: string
  isHaveNowpaymentsAccount?: boolean
  nowpaymentsId?: string
}

interface AuthState {
  // State
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  email: string | null

  // Actions
  setAuth: (token: string, userData?: Partial<User>) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  setEmail: (email: string | null) => void
  login: () => void
}

// JWT payload interface
interface JwtPayload {
  sub: number
  address?: string
  email?: string
  role: string
  exp: number
  isHaveNowpaymentsAccount?: boolean
  nowpaymentsId?: string
}

// Create store with persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      email: null,

      // Actions
      setAuth: (token: string, userData?: Partial<User>) => {
        try {
          // Decode JWT token
          const decoded = jwtDecode<JwtPayload>(token)
          
          // Create user object from token and provided data
          const user: User = {
            id: decoded.sub,
            email: userData?.email || decoded.email,
            address: userData?.address || decoded.address,
            role: userData?.role || decoded.role,
            isHaveNowpaymentsAccount: userData?.isHaveNowpaymentsAccount || decoded.isHaveNowpaymentsAccount,
            nowpaymentsId: userData?.nowpaymentsId || decoded.nowpaymentsId,
          }

          // Update state
          set({
            isAuthenticated: true,
            user,
            token,
            error: null,
          })
        } catch (error) {
          console.error('Failed to decode JWT token:', error)
          set({
            error: 'Invalid authentication token',
            isAuthenticated: false,
            user: null,
            token: null,
          })
        }
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
          email: null,
        })
      },

      setEmail: (email: string | null) => {
        set({ email })
      },

      login: () => {
        set({ isAuthenticated: true })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        email: state.email,

      }),
    }
  )
)