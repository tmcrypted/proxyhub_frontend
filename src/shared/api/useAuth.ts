import { useAuthStore } from './authStore'
import { authApi } from './authApi'

export function useAuth() {
  const {
    isAuthenticated,
    user,
    token,
    refreshToken,
    isLoading,
    error,
    email,
    setAuth,
    setCookieAuth,
    setLoading,
    setError,
    logout: logoutFromStore,
    setEmail,
    login,
    initializeFromStorage,
    refreshTokens,
  } = useAuthStore()

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.login({ email, password })
      return response
    } catch (error: any) {
      setError(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const registerWithEmail = async (email: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.register({ email, name })
      return response
    } catch (error: any) {
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await authApi.checkAuthStatus()
      
      if (response.isAuthenticated && response.user) {
        setCookieAuth(response.user)
      }
      
      return response
    } catch (error) {
      console.error('Auth status check failed:', error)
      return { isAuthenticated: false }
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    isAuthenticated,
    user,
    token,
    refreshToken,
    isLoading,
    error,
    email,
    
    // Actions
    loginWithEmail,
    registerWithEmail,
    logout,
    checkAuthStatus,
    setAuth,
    setCookieAuth,
    setLoading,
    setError,
    setEmail,
    login,
    initializeFromStorage,
    refreshTokens,
    
    // Derived state
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
    userId: user?.id,
    userAddress: user?.address,
    userRole: user?.role,
  }
} 