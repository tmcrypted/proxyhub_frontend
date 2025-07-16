import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/api/authStore'
import { authApi } from '@/shared/api/authApi'

// Hook for wallet authentication
export function useWalletAuth() {
  const { setAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ address, signature, message }: { 
      address: string; 
      signature: string; 
      message: string 
    }) => {
      // Using existing authService for wallet auth
      const response = await authApi.authenticateWallet(address, signature, message)
      return response
    },
    onSuccess: (data: { accessToken: string; user: { address: string } }) => {
      if (data.accessToken && data.user?.address) {
        setAuth(data.accessToken, { address: data.user.address })
      }
    },
  })
} 