import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Clock } from 'lucide-react'

const UserTransactions = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{t('profile.transactions.title')}</h3>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t('profile.transactions.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t('profile.transactions.empty')}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserTransactions 