import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAccount, useSignMessage } from 'wagmi'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/auth'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ConnectButton } from '../components/ui/connect-button'
import { config } from '../config'

export default function Auth() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { setAuth, setCookieAuth, isAuthenticated, isLoading, error, setLoading, setError } = useAuthStore()
  const authInProgressRef = useRef(false)
  const { t } = useTranslation()
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${config.api.baseUrl}/auth/email/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      console.log('Login response:', data)

      if (!data.accessToken) {
        throw new Error('No token received from server')
      }

      setAuth(data.accessToken, data.user ? { email: data.user.email } : undefined)
      navigate({ to: '/' })
    } catch (error) {
      console.error('Login error:', error)
      setError('Email authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${config.api.baseUrl}/auth/email/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: registerEmail, password: registerPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      setVerificationMessage({ 
        type: 'success', 
        text: 'Registration successful! Please check your email for verification link.' 
      })
      
      // Clear form and switch to login tab
      setRegisterEmail('')
      setRegisterPassword('')
      setConfirmPassword('')
      setActiveTab('login')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Choose your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-black text-black font-medium'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-black text-black font-medium'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {/* Login Tab */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
              <div className="text-center flex justify-center">
                <button
                  type="button"
                  className="text-sm text-black hover:text-gray-600 underline"
                  onClick={() => console.log('Forgot password clicked')} // TODO: implement forgot password
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* Register Tab */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Register'}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>

          {/* Wallet Authentication */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <ConnectButton
                label="Connect Wallet"
                className="w-full"
              />
            </div>
            {isConnected && (
              <div className="p-2.5 rounded bg-muted text-center">
                {isLoading ? (
                  <p className="m-0 text-sm">Authenticating...</p>
                ) : (
                  <p className="m-0 text-sm">Wallet Connected</p>
                )}
              </div>
            )}
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
      </Card>
    </div>
  )
} 