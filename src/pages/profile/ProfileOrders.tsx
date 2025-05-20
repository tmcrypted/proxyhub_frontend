import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Order {
    id: string;
    date: string;
    proxies: number;
    country: string;
    amount: number;
    status: 'active' | 'expired' | 'cancelled';
    expiresAt?: string;
}

const ProfileOrders = () => {
    const { t } = useTranslation()

    // Sample orders data - replace with API call
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'ord-123456',
            date: '2023-06-10',
            proxies: 5,
            country: 'US',
            amount: 45,
            status: 'active',
            expiresAt: '2023-07-10'
        },
        {
            id: 'ord-789012',
            date: '2023-05-15',
            proxies: 3,
            country: 'UK',
            amount: 30,
            status: 'expired',
            expiresAt: '2023-06-15'
        },
        {
            id: 'ord-345678',
            date: '2023-04-20',
            proxies: 2,
            country: 'CA',
            amount: 20,
            status: 'cancelled'
        }
    ]);

    // Function to get status badge
    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">{t('profile.orders.status.active')}</span>;
            case 'expired':
                return <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">{t('profile.orders.status.expired')}</span>;
            case 'cancelled':
                return <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">{t('profile.orders.status.cancelled')}</span>;
            default:
                return null;
        }
    };

    // Function to handle renew button click
    const handleRenew = (orderId: string) => {
        console.log(`Renewing order: ${orderId}`);
        // Implement renewal logic
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">{t('profile.orders.title')}</h3>
            
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                <th className="px-4 py-3 rounded-tl-lg">{t('profile.orders.table.orderId')}</th>
                                <th className="px-4 py-3">{t('profile.orders.table.date')}</th>
                                <th className="px-4 py-3">{t('profile.orders.table.proxies')}</th>
                                <th className="px-4 py-3">{t('profile.orders.table.country')}</th>
                                <th className="px-4 py-3">{t('profile.orders.table.amount')}</th>
                                <th className="px-4 py-3">{t('profile.orders.table.status')}</th>
                                <th className="px-4 py-3 rounded-tr-lg">{t('profile.orders.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-4 py-3 font-medium">{order.id}</td>
                                    <td className="px-4 py-3">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">{order.proxies}</td>
                                    <td className="px-4 py-3">{order.country}</td>
                                    <td className="px-4 py-3">${order.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.status === 'active' && (
                                            <button
                                                onClick={() => handleRenew(order.id)}
                                                className="text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {t('profile.orders.actions.renew')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">{t('profile.orders.empty')}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        {t('profile.orders.actions.buyProxies')}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileOrders 