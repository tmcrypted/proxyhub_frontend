import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

const UserReferrals = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{t('profile.referrals.title')}</h3>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {t('profile.referrals.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t('profile.referrals.users.empty')}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserReferrals 