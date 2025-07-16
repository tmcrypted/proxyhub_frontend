import { useProfileStore } from './store'
import type { Profile, ProfileStats, ProfileSettings } from './types'

// Basic selectors
export const useProfile = (): Profile | null => useProfileStore(state => state.profile)
export const useProfileStats = (): ProfileStats | null => useProfileStore(state => state.stats)
export const useProfileSettings = (): ProfileSettings | null => useProfileStore(state => state.settings)
export const useProfileLoading = (): boolean => useProfileStore(state => state.isLoading)
export const useProfileError = (): string | null => useProfileStore(state => state.error)

// Computed selectors
export const useIsAdmin = (): boolean => {
  const profile = useProfile()
  return profile?.role === 'ADMIN'
}

export const useIsUser = (): boolean => {
  const profile = useProfile()
  return profile?.role === 'USER'
}

export const useProfileId = (): number | undefined => {
  const profile = useProfile()
  return profile?.id
}

export const useProfileEmail = (): string | undefined => {
  const profile = useProfile()
  return profile?.email
}

export const useProfileAddress = (): string | undefined => {
  const profile = useProfile()
  return profile?.address
}

export const useProfileRole = (): string | undefined => {
  const profile = useProfile()
  return profile?.role
}

export const useHasNowpaymentsAccount = (): boolean => {
  const profile = useProfile()
  return profile?.isHaveNowpaymentsAccount || false
}

// Stats selectors
export const useTotalOrders = (): number => {
  const stats = useProfileStats()
  return stats?.totalOrders || 0
}

export const useTotalProxies = (): number => {
  const stats = useProfileStats()
  return stats?.totalProxies || 0
}

export const useTotalBalance = (): number => {
  const stats = useProfileStats()
  return stats?.totalBalance || 0
}

export const useTotalTransactions = (): number => {
  const stats = useProfileStats()
  return stats?.totalTransactions || 0
}

// Settings selectors
export const useEmailNotifications = (): boolean => {
  const settings = useProfileSettings()
  return settings?.emailNotifications || false
}

export const useWalletNotifications = (): boolean => {
  const settings = useProfileSettings()
  return settings?.walletNotifications || false
}

export const useProfileLanguage = (): 'en' | 'ru' => {
  const settings = useProfileSettings()
  return settings?.language || 'en'
}

export const useProfileTheme = (): 'light' | 'dark' | 'system' => {
  const settings = useProfileSettings()
  return settings?.theme || 'system'
} 