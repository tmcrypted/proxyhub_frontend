import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ProfileBalance = () => {
    const { t } = useTranslation()
    const [balance, setBalance] = useState(42) // Replace with actual balance from API

    // Handle top up button click
    const handleTopUp = () => {
        console.log('Top up clicked')
        // Implement top up logic
    }

    // Handle withdrawal button click 
    const handleWithdraw = () => {
        console.log('Withdraw clicked')
        // Implement withdrawal logic
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{t('profile.balance.title')}</h3>
            
            <div className="mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('profile.balance.current')}</p>
                    <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={handleTopUp}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {t('profile.balance.actions.topUp')}
                    </button>
                    <button
                        onClick={handleWithdraw}
                        className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
        </div>
    )
}

export default ProfileBalance 