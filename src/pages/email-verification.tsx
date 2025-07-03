import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { config } from '../config'

export default function EmailVerification() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (!token) {
      setVerificationResult({
        success: false,
        message: 'Invalid verification link. No token provided.'
      })
      setIsVerifying(false)
      return
    }

    // Redirect to backend verification endpoint
    // The backend will handle verification and redirect back to auth page
    window.location.href = `${config.api.baseUrl}/auth/email/verify?token=${token}`
  }, [])

  if (isVerifying) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">
              You will be redirected automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {verificationResult?.success ? 'Email Verified!' : 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {verificationResult?.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate({ to: '/auth' })}
            className="w-full"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 