import { useEffect } from 'react'
import { useInitializeFromStorage, useToken } from '@/shared/api/authStore'
import { apiClient } from './apiClient'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeFromStorage = useInitializeFromStorage()
  const token = useToken()

  // Initialize auth state from storage on app start
  useEffect(() => {
    initializeFromStorage()
  }, [initializeFromStorage])

  // Sync token with apiClient when it changes
  useEffect(() => {
    apiClient.setAuthToken(token)
  }, [token])

  return <>{children}</>
} 