import { Link, useLocation } from '@tanstack/react-router'
import { Server, Database, User, ShoppingCart, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const AdminPanelSidebar = () => {
    const location = useLocation()
    const { t } = useTranslation()

    // Navigation items for admin users
    const adminNavItems = [
        { name: t('profile.navigation.proxies'), icon: <Server className="w-5 h-5" />, path: '/admin/proxies' },
        { name: t('profile.navigation.branches'), icon: <Database className="w-5 h-5" />, path: '/admin/branches' },
        { name: t('profile.navigation.users'), icon: <User className="w-5 h-5" />, path: '/admin/users' },
        { name: t('profile.navigation.orders'), icon: <ShoppingCart className="w-5 h-5" />, path: '/admin/orders' },
        { name: t('profile.navigation.pricing'), icon: <DollarSign className="w-5 h-5" />, path: '/admin/pricing' }
    ]

    // Helper function to check if a link is active
    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-fit">
            <nav className="space-y-1">
                {adminNavItems.map((item) => (
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
            </nav>
        </div>
    )
}