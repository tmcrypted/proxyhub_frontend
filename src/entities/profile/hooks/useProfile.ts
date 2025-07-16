import { useEffect, useMemo } from 'react'
import { useProfileStore } from '../model/store'

export const useProfileLogic = () => {
  const { fetchProfile, updateProfile, updateSettings, fetchStats, resetError } = useProfileStore()
  
  // Use a memoized selector to get all profile data at once
  const { profile, isLoading, error } = useProfileStore(
    useMemo(
      () => (state: any) => ({
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error
      }),
      []
    )
  )
  
  // Computed values derived from profile
  const isAdmin = profile?.role === 'ADMIN'
  const isUser = profile?.role === 'USER'
  const profileId = profile?.id
  const profileEmail = profile?.email
  const profileAddress = profile?.address
  const profileRole = profile?.role
  const hasNowpaymentsAccount = profile?.isHaveNowpaymentsAccount || false

  // Load profile data on mount
  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile]) // Remove fetchProfile from dependencies

  return {
    // Data
    profile,
    isLoading,
    error,
    
    // Computed values
    isAdmin,
    isUser,
    profileId,
    profileEmail,
    profileAddress,
    profileRole,
    hasNowpaymentsAccount,
    
    // Actions
    fetchProfile,
    updateProfile,
    updateSettings,
    fetchStats,
    resetError,
  }
} 