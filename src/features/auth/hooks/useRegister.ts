import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/shared/api/authApi'

// Hook for registration
export function useRegister() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await authApi.register(credentials)
      return response
    },
  })
} 