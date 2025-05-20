import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/auth'
import { useTranslation } from 'react-i18next'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setAuth, setLoading, setError } = useAuthStore()
  const { t } = useTranslation()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setLoading(true)
        // Get the code from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (!code) {
          throw new Error('No code provided')
        }

        // Exchange the code for tokens
        const response = await authService.handleGoogleCallback(code)

        if (response.accessToken) {
          setAuth(response.accessToken)
          navigate({ to: '/' })
        } else {
          throw new Error('No access token received')
        }
      } catch (error) {
        console.error('Google callback error:', error)
        setError('Google authentication failed')
        navigate({ to: '/auth', search: { error: 'google_auth_failed' } })
      } finally {
        setLoading(false)
      }
    }

    handleGoogleCallback()
  }, [navigate, setAuth, setLoading, setError])

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-5">
      <div className="bg-background rounded-lg p-8 w-full max-w-[600px] shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">{t('auth.callback.title')}</h1>
        <p className="text-foreground">{t('auth.callback.message')}</p>
      </div>
    </div>
  )
} 