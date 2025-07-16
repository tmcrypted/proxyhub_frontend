import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAccount, useSignMessage } from 'wagmi'
import { useAuthStore } from '@/shared/api/authStore'
import { useAuthStatus } from './useAuthStatus'
import { useLogin } from './useLogin'
import { useRegister } from './useRegister'
import { useWalletAuth } from './useWalletAuth'
import { authApi } from '@/shared/api/authApi'

export function useAuthLogic() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { isAuthenticated, setCookieAuth } = useAuthStore()
  const authInProgressRef = useRef(false)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  // Form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // TanStack Query hooks
  const { data: authStatus } = useAuthStatus()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const walletAuthMutation = useWalletAuth()

  // Handle verification redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const verified = urlParams.get('verified')
    const message = urlParams.get('message')

    if (verified && message) {
      if (verified === 'true') {
        setVerificationMessage({ type: 'success', text: decodeURIComponent(message) })
        // Check if user is automatically logged in via cookies
        if (authStatus?.isAuthenticated && authStatus?.user) {
          setCookieAuth(authStatus.user)
        }
      } else {
        setVerificationMessage({ type: 'error', text: decodeURIComponent(message) })
      }

      // Clean up URL parameters
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [authStatus, setCookieAuth])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  // Auto-start wallet auth when connected
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !authInProgressRef.current) {
      handleWalletAuth()
    }
  }, [isConnected, address, isAuthenticated])

  const handleWalletAuth = async () => {
    if (!address) return

    if (authInProgressRef.current) {
      console.log('Authentication already in progress')
      return
    }

    authInProgressRef.current = true

    try {
      // Get nonce from backend
      const response = await authApi.getNonce(address)
      const messageToSign = response.message as string

      // Sign message
      const signature = await signMessageAsync({ message: messageToSign })

      // Authenticate wallet
      await walletAuthMutation.mutateAsync({ 
        address, 
        signature, 
        message: messageToSign 
      })

      navigate({ to: '/' })
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      authInProgressRef.current = false
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await loginMutation.mutateAsync({ 
        email: loginEmail, 
        password: loginPassword 
      })
      navigate({ to: '/' })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerPassword !== confirmPassword) {
      setVerificationMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    try {
      await registerMutation.mutateAsync({ 
        email: registerEmail, 
        password: registerPassword 
      })

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
      setVerificationMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Registration failed' 
      })
    }
  }

  const clearVerificationMessage = () => {
    setVerificationMessage(null)
  }

  return {
    // State
    activeTab,
    loginEmail,
    loginPassword,
    registerEmail,
    registerPassword,
    confirmPassword,
    verificationMessage,
    isConnected,
    
    // Mutations
    loginMutation,
    registerMutation,
    walletAuthMutation,
    
    // Actions
    setActiveTab,
    setLoginEmail,
    setLoginPassword,
    setRegisterEmail,
    setRegisterPassword,
    setConfirmPassword,
    clearVerificationMessage,
    handleLogin,
    handleRegister,
    handleWalletAuth,
  }
} 