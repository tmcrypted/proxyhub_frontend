import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
    AlertTriangle,  
    Home, 
    ArrowLeft, 
    RefreshCw,
    Search,
    Server
} from 'lucide-react'

interface ErrorProps {
    error?: {
        status?: number
        message?: string
    }
}

export const ErrorPage = ({ error }: ErrorProps) => {
    const { t } = useTranslation()

    // Determine error type and message
    const getErrorInfo = () => {
        if (error?.status === 404) {
            return {
                title: 'Page Not Found',
                message: 'The page you\'re looking for doesn\'t exist.',
                icon: <Search className="w-16 h-16 text-blue-600" />,
                code: '404'
            }
        }
        
        if (error?.status === 500) {
            return {
                title: 'Server Error',
                message: 'Something went wrong on our end. Please try again later.',
                icon: <Server className="w-16 h-16 text-red-600" />,
                code: '500'
            }
        }

        if (error?.status === 403) {
            return {
                title: 'Access Denied',
                message: 'You don\'t have permission to access this resource.',
                icon: <AlertTriangle className="w-16 h-16 text-yellow-600" />,
                code: '403'
            }
        }

        // Default error
        return {
            title: 'Something Went Wrong',
            message: 'An unexpected error occurred. Please try again.',
            icon: <AlertTriangle className="w-16 h-16 text-red-600" />,
            code: error?.status || 'Error'
        }
    }

    const errorInfo = getErrorInfo()

    const handleRefresh = () => {
        window.location.reload()
    }

    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                    {/* Error Icon */}
                    <div className="mb-6">
                        {errorInfo.icon}
                    </div>

                    {/* Error Code */}
                    <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
                        {errorInfo.code}
                    </div>

                    {/* Error Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {errorInfo.title}
                    </h1>

                    {/* Error Message */}
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {errorInfo.message}
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link to="/" className="w-full">
                            <Button className="w-full" size="lg">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                        
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1" 
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="flex-1" 
                                onClick={handleRefresh}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Need help? Contact our support team:
                        </p>
                        <div className="space-y-2 text-sm">
                            <a 
                                href="mailto:support@proxyhub.com" 
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block"
                            >
                                support@proxyhub.com
                            </a>
                            <a 
                                href="https://t.me/proxyhub_support" 
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block"
                            >
                                Telegram Support
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 