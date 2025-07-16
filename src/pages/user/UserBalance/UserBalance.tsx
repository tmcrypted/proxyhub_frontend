import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Wallet, Plus, Minus, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUserBalance } from '@/entities/profile/hooks/useProfileBalance'

const UserBalance = () => {
    const { t } = useTranslation()
    const { balance, isLoading } = useUserBalance()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{t('profile.balance.title')}</h3>
            </div>

            {/* Current Balance Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        {t('profile.balance.current')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${typeof balance === 'number' ? balance.toFixed(2) : '0.00'} USDC
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button asChild>
                            <Link to="/buy">
                                <Plus className="w-4 h-4 mr-2" />
                                {t('profile.balance.actions.topUp')}
                            </Link>
                        </Button>
                        <Button variant="outline" disabled>
                            <Minus className="w-4 h-4 mr-2" />
                            {t('profile.balance.actions.withdraw')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t('profile.balance.recentActivity')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t('profile.balance.empty')}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserBalance 