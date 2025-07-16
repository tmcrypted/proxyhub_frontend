import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProfileStore, Profile, ProfileStats, ProfileSettings } from './types'
import { profileApi } from '../api/profileApi'

const initialState = {
  profile: null,
  stats: null,
  settings: null,
  isLoading: false,
  error: null,
}

export const useProfileStore = create<ProfileStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchProfile: async () => {
        const state = get()
        // Prevent multiple simultaneous requests
        if (state.isLoading) {
          console.log('Profile fetch already in progress, skipping...')
          return
        }
        
        console.log('Fetching profile...')
        try {
          set({ isLoading: true, error: null })
          const profile = await profileApi.getProfile()
          console.log('Profile fetched successfully:', profile)
          set({ profile, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false 
          })
        }
      },

      updateProfile: async (data: Partial<Profile>) => {
        try {
          set({ isLoading: true, error: null })
          const updatedProfile = await profileApi.updateProfile(data)
          set({ profile: updatedProfile, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false 
          })
        }
      },

      updateSettings: async (settings: Partial<ProfileSettings>) => {
        try {
          set({ isLoading: true, error: null })
          const updatedSettings = await profileApi.updateSettings(settings)
          set({ settings: updatedSettings, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update settings',
            isLoading: false 
          })
        }
      },

      fetchStats: async () => {
        try {
          set({ isLoading: true, error: null })
          const stats = await profileApi.getStats()
          set({ stats, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
            isLoading: false 
          })
        }
      },

      resetError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'profile-store',
    }
  )
) 