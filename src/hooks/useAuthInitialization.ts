import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export function useAuthInitialization() {
  const { initializeFromStorage } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    initializeFromStorage()
  }, [initializeFromStorage])
} 