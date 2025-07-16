import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/api/apiClient'
import { useIsAdmin } from '@/shared/api/authStore'
import { useProfileStore } from '../model/store'

interface UserProfile {
  id: number
  role: string
  name: string | null
  email: string | null
  evmAddress: string
  authProvider: string
  password: string | null
  isHaveNowpaymentsAccount: boolean
  nowpaymentsId?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export const useUserBalance = () => {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isAdmin = useIsAdmin()
  const profile = useProfileStore((state: any) => state.profile)

  const fetchBalance = async () => {

    if (isAdmin) {
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const npId = profile?.nowpaymentsId
      
      if (!npId) {
        setBalance(null)
        setError('Payment account not found')
        return
      }

      const response = await apiClient.get<number>(`/payments/user-balance/${npId}`)
      setBalance(response as number)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError('Failed to load balance')
      setBalance(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      fetchBalance()
    }
  }, [isAdmin, profile])

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance
  }
} 