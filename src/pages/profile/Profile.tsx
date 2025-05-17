import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuthStore } from '../auth/store/authStore'
import { useDisconnect } from 'wagmi'
import { authRequests } from '../../shared/api/requests'
import { Wallet, Clock, ShoppingCart, Users, Settings, LogOut, Server, Database, User, DollarSign, Tag } from 'lucide-react'
import useIsAdmin from '../../hooks/useIsAdmin'

const Profile = () => {
    const { isAuthenticated, address, email } = useAuthStore()
    const { disconnect } = useDisconnect()
    const location = useLocation()
    const isAdmin = useIsAdmin()
    
    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <h2 className="text-3xl font-bold mb-6">Please login to view your profile</h2>
            </div>
        )
    }

    // For admin users, redirect to the proxies page if they're at the root profile page
    if (isAdmin && location.pathname === '/profile') {
        return <Navigate to="/profile/admin/proxies" replace />;
    }

    // Helper function to check if a link is active
    const isActive = (path: string) => {
        return location.pathname === path;
    }

    // Navigation items for regular users
    const userNavItems = [
        { name: 'Balance', icon: <Wallet className="w-5 h-5" />, path: '/profile' },
        { name: 'Transactions', icon: <Clock className="w-5 h-5" />, path: '/profile/transactions' },
        { name: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, path: '/profile/orders' },
        { name: 'Referrals', icon: <Users className="w-5 h-5" />, path: '/profile/referrals' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/profile/settings' }
    ];

    // Navigation items for admin users
    const adminNavItems = [
        { name: 'Proxies', icon: <Server className="w-5 h-5" />, path: '/profile/admin/proxies' },
        { name: 'Branches', icon: <Database className="w-5 h-5" />, path: '/profile/admin/branches' },
        { name: 'Users', icon: <User className="w-5 h-5" />, path: '/profile/admin/users' },
        { name: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, path: '/profile/admin/orders' },
        { name: 'Pricing', icon: <DollarSign className="w-5 h-5" />, path: '/profile/admin/pricing' },
        { name: 'Promo Codes', icon: <Tag className="w-5 h-5" />, path: '/profile/admin/promo-codes' }
    ];

    // Select navigation items based on user role
    const navItems = isAdmin ? adminNavItems : userNavItems;

    // Async logout function for the logout button
    const handleLogout = async () => {
        try {
            await authRequests.logout()
            disconnect()
            useAuthStore.getState().logout()
        } catch (error) {
            console.error('Error logging out:', error)
            disconnect()
            useAuthStore.getState().logout()
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">
                {isAdmin ? 'Admin Dashboard' : 'Your Account'}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left sidebar with navigation */}
                <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md h-fit">
                    <div className="mb-6">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logged in as:</div>
                        <div className="font-medium truncate">{email || address}</div>
                        {isAdmin && (
                            <div className="mt-1 text-xs font-semibold text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 py-1 px-2 rounded">
                                Administrator
                            </div>
                        )}
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
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
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-md w-full transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
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

export default Profile 