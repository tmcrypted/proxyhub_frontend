import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import { authApi } from './authApi'

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
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  email: string | null

  // Actions
  setAuth: (token: string, refreshToken: string, userData?: Partial<User>) => void
  setCookieAuth: (userData: User) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  setEmail: (email: string | null) => void
  login: () => void
  initializeFromStorage: () => void
  refreshTokens: () => Promise<boolean>
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
  refreshToken: null,
  isLoading: false,
  error: null,
  email: null,

  // Actions
  setAuth: (token: string, refreshToken: string, userData?: Partial<User>) => {
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
          refreshToken: null,
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
        refreshToken,
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
        refreshToken: null,
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
      refreshToken: 'cookie-based',
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
      refreshToken: null,
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

  refreshTokens: async () => {
    const { refreshToken } = get()
    
    if (!refreshToken || refreshToken === 'cookie-based') {
      return false
    }

    try {
      set({ isLoading: true, error: null })
      
      const response = await authApi.refresh({ refreshToken })
      
      // Update tokens
      const newState = {
        token: response.accessToken,
        refreshToken: response.refreshToken,
        error: null,
      }
      set(newState)
      saveToStorage(newState)
      
      return true
    } catch (error) {
      console.error('Failed to refresh tokens:', error)
      // If refresh fails, logout user
      get().logout()
      return false
    } finally {
      set({ isLoading: false })
    }
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
                refreshToken: state.refreshToken,
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
                  refreshToken: state.refreshToken,
                  email: state.email,
                  error: null,
                })
              } else {
                // Token expired, try to refresh
                if (state.refreshToken && state.refreshToken !== 'cookie-based') {
                  // Try to refresh in background
                  get().refreshTokens()
                } else {
                  // No refresh token, clear storage
                  localStorage.removeItem('auth-storage')
                  set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    refreshToken: null,
                    email: null,
                    error: 'Token expired',
                  })
                }
              }
            }
          } catch (error) {
            // Invalid token, clear storage
            localStorage.removeItem('auth-storage')
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              refreshToken: null,
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

// Selectors for easier access to auth state
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useUser = () => useAuthStore(state => state.user)
export const useToken = () => useAuthStore(state => state.token)
export const useRefreshToken = () => useAuthStore(state => state.refreshToken)
export const useAuthLoading = () => useAuthStore(state => state.isLoading)
export const useAuthError = () => useAuthStore(state => state.error)
export const useAuthEmail = () => useAuthStore(state => state.email)

// Derived selectors
export const useIsAdmin = () => useAuthStore(state => state.user?.role === 'ADMIN')
export const useIsUser = () => useAuthStore(state => state.user?.role === 'USER')
export const useUserId = () => useAuthStore(state => state.user?.id)
export const useUserAddress = () => useAuthStore(state => state.user?.address)
export const useUserRole = () => useAuthStore(state => state.user?.role)

// Actions
export const useSetAuth = () => useAuthStore(state => state.setAuth)
export const useSetCookieAuth = () => useAuthStore(state => state.setCookieAuth)
export const useSetLoading = () => useAuthStore(state => state.setLoading)
export const useSetError = () => useAuthStore(state => state.setError)
export const useLogout = () => useAuthStore(state => state.logout)
export const useSetEmail = () => useAuthStore(state => state.setEmail)
export const useLogin = () => useAuthStore(state => state.login)
export const useInitializeFromStorage = () => useAuthStore(state => state.initializeFromStorage)
export const useRefreshTokens = () => useAuthStore(state => state.refreshTokens)