import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/shared/api/authApi'
import { useAuthStore } from '@/shared/api/authStore'

// Hook for login
export function useLogin() {
  const { setAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authApi.login(credentials)
      return response
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
    },
  })
} 