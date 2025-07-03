import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAccount, useSignMessage } from 'wagmi'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/auth'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { ConnectButton } from '../components/ui/connect-button'
import { config } from '../config'

export default function Auth() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { setAuth, setCookieAuth, isAuthenticated, isLoading, error, setLoading, setError } = useAuthStore()
  const authInProgressRef = useRef(false)
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Handle verification redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const verified = urlParams.get('verified')
    const message = urlParams.get('message')

    if (verified && message) {
      if (verified === 'true') {
        setVerificationMessage({ type: 'success', text: decodeURIComponent(message) })
        // Check if user is automatically logged in via cookies
        checkAuthStatus()
      } else {
        setVerificationMessage({ type: 'error', text: decodeURIComponent(message) })
      }

      // Clean up URL parameters
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${config.api.baseUrl}/auth/status`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      })

      if (response.ok) {
        const data = await response.json()
        if (data.isAuthenticated && data.user) {
          // User is authenticated via cookies, update auth store
          setCookieAuth(data.user)
          // The useEffect below will redirect to home
        }
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
    }
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  // Auto-start wallet auth when connected
  useEffect(() => {
    if (isConnected && address && !isLoading && !isAuthenticated && !authInProgressRef.current) {
      handleWalletAuth()
    }
  }, [isConnected, address])

  const handleWalletAuth = async () => {
    if (!address) {
      setError('Wallet connected but address not available')
      return
    }

    if (authInProgressRef.current) {
      console.log('Authentication already in progress')
      return
    }

    authInProgressRef.current = true
    setError(null)
    setLoading(true)

    try {
      // 1. Get nonce from backend
      const response = await authService.getNonce(address)
      const messageToSign = response.message

      // 2. Sign message - standard UI for signature will appear
      const signature = await signMessageAsync({ message: messageToSign })

      // 3. Send signature to backend
      const authResponse = await authService.authenticateWallet(address, signature, messageToSign)

      // 4. Check authentication success
      if (authResponse.accessToken && authResponse.refreshToken) {
        setAuth(authResponse.accessToken, { address })
        navigate({ to: '/' })
      } else {
        setError(authResponse.message || 'Authentication error')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setError('Authentication failed')
    } finally {
      setLoading(false)
      authInProgressRef.current = false
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      const response = await authService.initiateGoogleAuth()
      // Redirect to backend's Google auth endpoint
      window.location.href = response.url
    } catch (error) {
      console.error('Google auth error:', error)
      setError('Google authentication failed')
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
              const response = await fetch(`${config.api.baseUrl}/auth/email/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      console.log('Login response:', data) // Debug log

      // Check if we have the required data
      if (!data.accessToken) {
        throw new Error('No token received from server')
      }

      // Set auth with just the token if user data is not available
      setAuth(data.accessToken, data.user ? { email: data.user.email } : undefined)
      navigate({ to: '/' })
    } catch (error) {
      console.error('Login error:', error)
      setError('Email authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.title')}</CardTitle>
          <CardDescription>{t('auth.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {t('auth.login.submit')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.or')}
              </span>
            </div>
          </div>

          {/* Wallet Authentication */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('auth.wallet.title')}</h3>
            <div className="flex justify-center">
              <ConnectButton
                label={t('auth.wallet.connect')}
                className="w-full"
              />
            </div>
            {isConnected && (
              <div className="p-2.5 rounded bg-muted text-center">
                {isLoading ? (
                  <p className="m-0 text-sm">{t('auth.wallet.authenticating')}</p>
                ) : (
                  <p className="m-0 text-sm">{t('auth.wallet.connected')}</p>
                )}
              </div>
            )}
          </div>

          {/* Google Authentication */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('auth.google.title')}</h3>
            <Button 
              className="w-full py-3 px-3 rounded-md text-white border-none cursor-pointer font-medium transition-colors duration-300 flex items-center justify-center gap-2.5 bg-[#4285F4] hover:bg-[#357ABD] disabled:bg-[#95a5a6] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              {t('auth.google.signIn')}
            </Button>
          </div>

          {verificationMessage && (
            <div className={`p-4 rounded text-center ${
              verificationMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {verificationMessage.text}
            </div>
          )}

          {error && (
            <div className="p-4 rounded bg-destructive/10 text-destructive text-center">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: '/register' })}
          >
            {t('auth.login.register')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 