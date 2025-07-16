import { apiClient } from '@/shared/api/apiClient'
import type { 
  Profile, 
  UpdateProfileRequest, 
  ProfileStats, 
  ProfileSettings, 
  UpdateSettingsRequest 
} from '../model/types'

export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/users/profile')
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    return apiClient.patch<Profile>('/users/profile', data)
  },

  // Get profile statistics
  getStats: async (): Promise<ProfileStats> => {
    return apiClient.get<ProfileStats>('/users/profile/stats')
  },

  // Get user settings
  getSettings: async (): Promise<ProfileSettings> => {
    return apiClient.get<ProfileSettings>('/users/profile/settings')
  },

  // Update user settings
  updateSettings: async (data: UpdateSettingsRequest): Promise<ProfileSettings> => {
    return apiClient.patch<ProfileSettings>('/users/profile/settings', data)
  },

  // Delete user account
  deleteAccount: async (): Promise<void> => {
    return apiClient.delete('/users/profile')
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    return apiClient.post('/users/profile/change-password', data)
  },

  // Request email verification
  requestEmailVerification: async (): Promise<void> => {
    return apiClient.post('/users/profile/request-email-verification')
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    return apiClient.post('/users/profile/verify-email', { token })
  }
} 