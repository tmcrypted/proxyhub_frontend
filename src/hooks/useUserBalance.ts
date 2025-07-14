import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { userRequests } from '../services/api/requests'
import useIsAdmin from './useIsAdmin'

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

  const fetchBalance = async () => {
    // Don't fetch balance for admin users
    if (isAdmin) {
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const profile = await userRequests.getProfile() as UserProfile
      const npId = profile.nowpaymentsId
      
      if (!npId) {
        setBalance(null)
        setError('Payment account not found')
        return
      }
      
      const response = await api.get(`/payments/user-balance/${npId}`)
      setBalance(response)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError('Failed to load balance')
      setBalance(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [isAdmin])

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance
  }
} 