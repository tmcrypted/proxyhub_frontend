import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

const AdminSettings = () => {
    const { t } = useTranslation()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('profile.settings.admin')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Admin-specific settings content will be here
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminSettings 