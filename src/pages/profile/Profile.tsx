import { Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import useIsAdmin from '@/hooks/useIsAdmin'
import ProfileSidebar from '../Profile/ProfileSidebar'

const Profile = () => {
    const { t } = useTranslation()
    const isAdmin = useIsAdmin()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if we're on the exact /profile path (not a sub-route)
        if (location.pathname === '/profile') {
            // Redirect to first available link based on user role
            if (isAdmin) {
                // For admin users, redirect to settings (first item in adminNavItems)
                navigate({ to: '/profile/settings' })
            } else {
                // For regular users, redirect to balance (first item in userNavItems)
                navigate({ to: '/profile/balance' })
            }
        }
    }, [isAdmin, navigate, location.pathname])

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">
                {isAdmin ? t('profile.adminSettings') : t('profile.title')}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                <ProfileSidebar />
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md min-h-[400px]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Profile 