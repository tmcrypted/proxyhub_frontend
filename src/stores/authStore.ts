import { create } from 'zustand'
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
  setCookieAuth: (userData: User) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  setEmail: (email: string | null) => void
  login: () => void
  initializeFromStorage: () => void
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

// Helper function to save state to localStorage
const saveToStorage = (state: Partial<AuthState>) => {
  try {
    const authStorage = localStorage.getItem('auth-storage')
    const existingState = authStorage ? JSON.parse(authStorage) : { state: {} }
    
    const newState = {
      ...existingState,
      state: {
        ...existingState.state,
        ...state
      }
    }
    
    localStorage.setItem('auth-storage', JSON.stringify(newState))
  } catch (error) {
    console.error('Failed to save auth state to storage:', error)
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
      
      // Check if token is expired
      const currentTime = Date.now() / 1000
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn('Token is expired')
        const newState = {
          error: 'Token is expired',
          isAuthenticated: false,
          user: null,
          token: null,
        }
        set(newState)
        saveToStorage(newState)
        return
      }
      
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
      const newState = {
        isAuthenticated: true,
        user,
        token,
        error: null,
      }
      set(newState)
      saveToStorage(newState)
    } catch (error) {
      console.error('Failed to decode JWT token:', error)
      const newState = {
        error: 'Invalid authentication token',
        isAuthenticated: false,
        user: null,
        token: null,
      }
      set(newState)
      saveToStorage(newState)
    }
  },

  setCookieAuth: (userData: User) => {
    const newState = {
      isAuthenticated: true,
      user: userData,
      token: 'cookie-based',
      error: null,
    }
    set(newState)
    saveToStorage(newState)
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  logout: () => {
    const newState = {
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      email: null,
    }
    set(newState)
    saveToStorage(newState)
    // Also clear localStorage
    localStorage.removeItem('auth-storage')
  },

  setEmail: (email: string | null) => {
    const newState = { email }
    set(newState)
    saveToStorage(newState)
  },

  login: () => {
    const newState = { isAuthenticated: true }
    set(newState)
    saveToStorage(newState)
  },

  initializeFromStorage: () => {
    try {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const { state } = JSON.parse(authStorage)
        if (state.token && state.isAuthenticated) {
          // Check if token is still valid
          try {
            if (state.token === 'cookie-based') {
              // Cookie-based auth, restore state
              set({
                isAuthenticated: true,
                user: state.user,
                token: state.token,
                email: state.email,
                error: null,
              })
            } else {
              const decoded = jwtDecode<JwtPayload>(state.token)
              const currentTime = Date.now() / 1000
              
              if (decoded.exp && decoded.exp > currentTime) {
                // Token is still valid, restore state
                set({
                  isAuthenticated: true,
                  user: state.user,
                  token: state.token,
                  email: state.email,
                  error: null,
                })
              } else {
                // Token expired, clear storage
                localStorage.removeItem('auth-storage')
                set({
                  isAuthenticated: false,
                  user: null,
                  token: null,
                  email: null,
                  error: 'Token expired',
                })
              }
            }
          } catch (error) {
            // Invalid token, clear storage
            localStorage.removeItem('auth-storage')
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              email: null,
              error: 'Invalid token',
            })
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth from storage:', error)
    }
  },
}))