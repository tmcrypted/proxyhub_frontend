import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Settings as SettingsIcon } from 'lucide-react'

interface GeneralSettingsProps {
    formData: {
        language: string;
        theme: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const GeneralSettings = ({ formData, handleInputChange, handleSubmit }: GeneralSettingsProps) => {
    const { t } = useTranslation()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    {t('profile.settings.general')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preferences settings */}
                    <div>
                        <h4 className="font-medium mb-3">
                            {t('profile.settings.preferences.title')}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="language" className="block text-sm mb-1.5 text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.preferences.language')}
                                </label>
                                <select
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                                >
                                    <option value="en">{t('profile.settings.preferences.languages.english')}</option>
                                    <option value="ru">{t('profile.settings.preferences.languages.russian')}</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="theme" className="block text-sm mb-1.5 text-gray-700 dark:text-gray-300">
                                    {t('profile.settings.preferences.theme')}
                                </label>
                                <select
                                    id="theme"
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                                >
                                    <option value="system">{t('profile.settings.preferences.themes.system')}</option>
                                    <option value="light">{t('profile.settings.preferences.themes.light')}</option>
                                    <option value="dark">{t('profile.settings.preferences.themes.dark')}</option>
                                </select>
                            </div>
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

export default GeneralSettings 