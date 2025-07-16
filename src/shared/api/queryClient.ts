import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (handled by token refresh)
        if (error?.status === 401) return false
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      
      // Refetch on window focus
      refetchOnWindowFocus: true,
      
      // Stale time - how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time - how long to keep data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false
        return failureCount < 2
      },
    }
  }
}) 