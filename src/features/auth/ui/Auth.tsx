import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ConnectButton } from '@/shared/components/ui/connect-button'
import { useAuthLogic } from '../hooks/useAuthLogic'

export default function Auth() {
  const { t } = useTranslation()
  const {
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
    handleLogin,
    handleRegister,
  } = useAuthLogic()

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Login'}
              </Button>
              <div className="text-center flex justify-center">
                <button
                  type="button"
                  className="text-sm text-black hover:text-gray-600 underline"
                  onClick={() => console.log('Forgot password clicked')}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterEmail(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterPassword(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Register'}
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
                {walletAuthMutation.isPending ? (
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

          {/* Error Messages */}
          {(loginMutation.error || registerMutation.error || walletAuthMutation.error) && (
            <div className="p-4 rounded bg-destructive/10 text-destructive text-center">
              {loginMutation.error?.message || 
               registerMutation.error?.message || 
               walletAuthMutation.error?.message || 
               'An error occurred'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 