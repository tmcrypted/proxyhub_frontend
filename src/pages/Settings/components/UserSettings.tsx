import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'

interface UserSettingsProps {
    formData: {
        email: string;
        notifyOnPurchase: boolean;
        notifyOnExpiration: boolean;
        notifyOnPromotion: boolean;
        telegramNotifications: boolean;
        telegramUsername: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const UserSettings = ({ formData, handleInputChange, handleSubmit }: UserSettingsProps) => {
    const { t } = useTranslation()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('profile.settings.user')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email settings */}
                    <div>
                        <h4 className="font-medium mb-3">
                            {t('profile.settings.email.title')}
                        </h4>
                        <div>
                            <label htmlFor="email" className="block text-sm mb-1.5 text-gray-700 dark:text-gray-300">
                                {t('profile.settings.email.label')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Notifications settings */}
                    <div>
                        <h4 className="font-medium mb-3">
                            {t('profile.settings.notifications.title')}
                        </h4>
                        
                        <div className="space-y-2.5">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifyOnPurchase"
                                    name="notifyOnPurchase"
                                    checked={formData.notifyOnPurchase}
                                    onChange={handleInputChange}
                                    className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <label htmlFor="notifyOnPurchase" className="text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.notifications.purchase')}
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifyOnExpiration"
                                    name="notifyOnExpiration"
                                    checked={formData.notifyOnExpiration}
                                    onChange={handleInputChange}
                                    className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <label htmlFor="notifyOnExpiration" className="text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.notifications.expiration')}
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifyOnPromotion"
                                    name="notifyOnPromotion"
                                    checked={formData.notifyOnPromotion}
                                    onChange={handleInputChange}
                                    className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <label htmlFor="notifyOnPromotion" className="text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.notifications.promotions')}
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Telegram settings */}
                    <div>
                        <h4 className="font-medium mb-3">
                            {t('profile.settings.telegram.title')}
                        </h4>
                        
                        <div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="telegramNotifications"
                                    name="telegramNotifications"
                                    checked={formData.telegramNotifications}
                                    onChange={handleInputChange}
                                    className="mr-3 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                />
                                <label htmlFor="telegramNotifications" className="text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.telegram.enable')}
                                </label>
                            </div>
                            
                            {formData.telegramNotifications && (
                                <div>
                                    <label htmlFor="telegramUsername" className="block text-sm mb-1.5 text-gray-700 dark:text-gray-300">
                                        {t('profile.settings.telegram.username')}
                                    </label>
                                    <input
                                        type="text"
                                        id="telegramUsername"
                                        name="telegramUsername"
                                        value={formData.telegramUsername}
                                        onChange={handleInputChange}
                                        placeholder="@username"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                        >
                            {t('profile.settings.save')}
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default UserSettings 