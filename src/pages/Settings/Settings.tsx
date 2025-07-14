import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useIsAdmin from '@/hooks/useIsAdmin'
import { useAuthStore } from '@/stores/authStore'
import GeneralSettings from './components/GeneralSettings'
import UserSettings from './components/UserSettings'
import AdminSettings from './components/AdminSettings'

const Settings = () => {
    const { t } = useTranslation()
    const isAdmin = useIsAdmin()
    const { user } = useAuthStore()

    // User settings form state
    const [formData, setFormData] = useState({
        email: user?.email || '',
        notifyOnPurchase: true,
        notifyOnExpiration: true,
        notifyOnPromotion: false,
        telegramNotifications: false,
        telegramUsername: '',
        language: 'en',
        theme: 'system'
    });

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Handle checkbox inputs
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: checkbox.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving settings:', formData);
        // Implement API call to save user settings
        alert(t('profile.settings.saved'));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                    {isAdmin ? t('profile.adminSettings') : t('profile.settings.title')}
                </h3>
            </div>

            {/* General Settings - for all users */}
            <GeneralSettings 
                formData={{ language: formData.language, theme: formData.theme }}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />

            {/* User-specific settings - only for regular users */}
            {!isAdmin && (
                <UserSettings 
                    formData={{
                        email: formData.email,
                        notifyOnPurchase: formData.notifyOnPurchase,
                        notifyOnExpiration: formData.notifyOnExpiration,
                        notifyOnPromotion: formData.notifyOnPromotion,
                        telegramNotifications: formData.telegramNotifications,
                        telegramUsername: formData.telegramUsername
                    }}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            )}

            {/* Admin-specific settings - only for admins */}
            {isAdmin && <AdminSettings />}
        </div>
    )
}

export default Settings 