import { useEffect } from 'react'
import { useProfileStore } from '../model/store'
import { 
  useProfileStats,
  useTotalOrders,
  useTotalProxies,
  useTotalBalance,
  useTotalTransactions
} from '../model/selectors'

export const useProfileStatsLogic = () => {
  const { fetchStats } = useProfileStore()
  
  const stats = useProfileStats()
  const totalOrders = useTotalOrders()
  const totalProxies = useTotalProxies()
  const totalBalance = useTotalBalance()
  const totalTransactions = useTotalTransactions()

  // Load stats on mount
  useEffect(() => {
    if (!stats) {
      fetchStats()
    }
  }, [stats, fetchStats])

  return {
    stats,
    totalOrders,
    totalProxies,
    totalBalance,
    totalTransactions,
    fetchStats,
  }
} 