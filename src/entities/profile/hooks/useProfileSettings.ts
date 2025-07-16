import { useEffect } from 'react'
import { useProfileStore } from '../model/store'
import { 
  useProfileSettings,
  useEmailNotifications,
  useWalletNotifications,
  useProfileLanguage,
  useProfileTheme
} from '../model/selectors'
import type { ProfileSettings } from '../model/types'

export const useProfileSettingsLogic = () => {
  const { updateSettings } = useProfileStore()
  
  const settings = useProfileSettings()
  const emailNotifications = useEmailNotifications()
  const walletNotifications = useWalletNotifications()
  const language = useProfileLanguage()
  const theme = useProfileTheme()

  // Load settings on mount
  useEffect(() => {
    if (!settings) {
      // Settings will be loaded with profile
    }
  }, [settings])

  const updateProfileSettings = async (newSettings: Partial<ProfileSettings>) => {
    await updateSettings(newSettings)
  }

  return {
    settings,
    emailNotifications,
    walletNotifications,
    language,
    theme,
    updateProfileSettings,
  }
} 