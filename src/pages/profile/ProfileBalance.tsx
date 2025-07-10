import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { userRequests } from '../../services/api/requests'
import { api } from '../../lib/api'
import ProfileTopup from './ProfileTopup'

interface UserProfile {
    id: number
    role: string
    name: string | null
    email: string | null
    evmAddress: string
    authProvider: string
    password: string | null
    isHaveNowpaymentsAccount: boolean
    nowpaymentsId?: string
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

const ProfileBalance = () => {
    const { t } = useTranslation()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [balance, setBalance] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isTopupOpen, setIsTopupOpen] = useState(false)

    useEffect(() => {
        const fetchUserAndBalance = async () => {
            setIsLoading(true)
            try {
                const profile = await userRequests.getProfile() as UserProfile
                setUser(profile)
                const npId = profile.nowpaymentsId
                if (!npId) {
                    setBalance(null)
                    setError('nowpaymentsId не найден')
                    return
                }
                const response = await api.get(`/payments/user-balance/${npId}`)
                setBalance(response)
                setError(null)
            } catch (err) {
                console.error('Failed to fetch user or balance:', err)
                setError('Ошибка загрузки баланса или пользователя')
                setBalance(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserAndBalance()
    }, [])


    const handleTopUp = () => {
        setIsTopupOpen(true)
    }

    const handleWithdraw = () => {
        console.log('Withdraw clicked')
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{t('profile.balance.title')}</h3>
            
            <div className="mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.balance.current')}</p>
                    {isLoading ? (
                        <p className="text-3xl font-bold">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <p className="text-3xl font-bold">${balance?.toFixed(2) || '0.00'}</p>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={handleTopUp}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        disabled={isLoading}
                    >
                        {t('profile.balance.actions.topUp')}
                    </button>
                    <button
                        onClick={handleWithdraw}
                        className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        disabled={isLoading}
                    >
                        {t('profile.balance.actions.withdraw')}
                    </button>
                </div>
            </div>
            
            <div>
                <h4 className="font-medium mb-4">{t('profile.balance.recentActivity')}</h4>
                
                {/* Empty state */}
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">{t('profile.balance.empty')}</p>
                </div>
                
                {/* You can replace the empty state with actual transaction list when available */}
            </div>

            {/* Top-up Dialog */}
            {isTopupOpen && user?.nowpaymentsId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{t('profile.topup.title')}</h3>
                                <button
                                    onClick={() => setIsTopupOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>
                            <ProfileTopup nowpaymentsId={user.nowpaymentsId} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileBalance 