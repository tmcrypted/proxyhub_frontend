// Profile types
export interface Profile {
  id: number
  email: string
  address?: string
  role: 'USER' | 'ADMIN'
  isHaveNowpaymentsAccount?: boolean
  nowpaymentsId?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  email?: string
  address?: string
}

export interface ProfileStats {
  totalOrders: number
  totalProxies: number
  totalBalance: number
  totalTransactions: number
}

export interface ProfileSettings {
  emailNotifications: boolean
  walletNotifications: boolean
  language: 'en' | 'ru'
  theme: 'light' | 'dark' | 'system'
}

export interface UpdateSettingsRequest {
  emailNotifications?: boolean
  walletNotifications?: boolean
  language?: 'en' | 'ru'
  theme?: 'light' | 'dark' | 'system'
}

// Profile state
export interface ProfileState {
  profile: Profile | null
  stats: ProfileStats | null
  settings: ProfileSettings | null
  isLoading: boolean
  error: string | null
}

// Profile actions
export interface ProfileActions {
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  updateSettings: (settings: Partial<ProfileSettings>) => Promise<void>
  fetchStats: () => Promise<void>
  resetError: () => void
}

// Profile store
export interface ProfileStore extends ProfileState, ProfileActions {} 