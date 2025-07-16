import { Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import ProfileSidebar from './ProfileSidebar'
import { useProfileStore } from '@/entities/profile/model/store'


const Profile = () => {
    const { t } = useTranslation()
    // Use individual selectors to avoid unnecessary re-renders
    const profile = useProfileStore((state: any) => state.profile)
    const isLoading = useProfileStore((state: any) => state.isLoading)
    const isAdmin = profile?.role === 'ADMIN'
    const navigate = useNavigate()
    const location = useLocation()

    console.log('Profile component - profile:', profile, 'isLoading:', isLoading, 'isAdmin:', isAdmin)

    // Load profile data on mount
    useEffect(() => {
        console.log('Profile component useEffect - profile:', profile)
        if (!profile) {
            console.log('Profile is null, fetching...')
            useProfileStore.getState().fetchProfile()
        }
    }, [profile])

    useEffect(() => {
        // Check if we're on the exact /profile path (not a sub-route)
        if (location.pathname === '/profile' && !isLoading && profile) {
            console.log('Redirecting based on role - isAdmin:', isAdmin)
            // Redirect to first available link based on user role
            if (isAdmin) {
                // For admin users, redirect to settings (first item in adminNavItems)
                navigate({ to: '/profile/settings' })
            } else {
                // For regular users, redirect to balance (first item in userNavItems)
                navigate({ to: '/profile/balance' })
            }
        }
    }, [isAdmin, location.pathname, isLoading, profile]) // Remove navigate from dependencies

    if (isLoading || !profile) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">
                {profile?.role === 'ADMIN' ? t('profile.adminSettings') : t('profile.title')}
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