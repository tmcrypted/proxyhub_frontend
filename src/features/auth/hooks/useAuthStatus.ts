import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/shared/api/authApi'

// Query keys
export const authKeys = {
  status: ['auth', 'status'] as const,
}

// Hook for checking auth status
export function useAuthStatus() {
  return useQuery({
    queryKey: authKeys.status,
    queryFn: async () => {
      const response = await authApi.checkAuthStatus()
      return response
    },
    // Don't refetch on window focus for auth status
    refetchOnWindowFocus: false,
    // Don't retry auth status checks
    retry: false,
  })
} 