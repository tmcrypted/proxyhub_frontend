import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '../../stores/authStore'
import { useDisconnect } from 'wagmi'
import { authRequests } from '../../services/api/requests'
import { Wallet, Clock, ShoppingCart, Users, Settings, LogOut, Wifi } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const UserProfile = () => {
    const { isAuthenticated, user, email } = useAuthStore()
    const { disconnect } = useDisconnect()
    const location = useLocation()
    const { t } = useTranslation()
    
    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">{t('profile.loginRequired')}</h2>
            </div>
        )
    }

    // Navigation items for regular users
    const userNavItems = [
        { name: t('profile.navigation.balance'), icon: <Wallet className="w-5 h-5" />, path: '/profile' },
        { name: t('profile.navigation.transactions'), icon: <Clock className="w-5 h-5" />, path: '/profile/transactions' },
        { name: t('profile.navigation.orders'), icon: <ShoppingCart className="w-5 h-5" />, path: '/profile/orders' },
        { name: t('profile.navigation.proxies'), icon: <Wifi className="w-5 h-5" />, path: '/profile/proxies' },
        { name: t('profile.navigation.referrals'), icon: <Users className="w-5 h-5" />, path: '/profile/referrals' },
        { name: t('profile.navigation.settings'), icon: <Settings className="w-5 h-5" />, path: '/profile/settings' }
    ]

    // Helper function to check if a link is active
    const isActive = (path: string) => {
        return location.pathname === path
    }

    // Async logout function for the logout button
    const handleLogout = async () => {
        try {
            // First disconnect the wallet
            await disconnect()
            // Then logout from the backend
            await authRequests.logout()
            // Finally clear the auth store
            useAuthStore.getState().logout()
        } catch (error) {
            console.error('Error logging out:', error)
            // Even if there's an error, try to disconnect the wallet and clear the store
            await disconnect()
            useAuthStore.getState().logout()
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">
                {t('profile.title')}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left sidebar with navigation */}
                <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-fit">
                    <div className="mb-6">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.loggedInAs')}</div>
                        <div className="font-medium truncate">{email || user?.address}</div>
                    </div>

                    <nav className="space-y-1">
                        {userNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-md w-full transition-colors ${
                                    isActive(item.path)
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {/* Logout button */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-md w-full transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{t('profile.logout')}</span>
                        </button>
                    </nav>
                </div>

                {/* Right content area */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md min-h-[400px]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default UserProfile 