import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../../lib/api'

// Interface based on backend Order model structure
interface OrderProxy {
    id: number;
    proxy: {
        id: number;
        ip: string;
        port: string;
        login: string;
        password: string;
        proxyCountry: {
            id: number;
            countryName: string;
            countryTicker: string;
        };
        expiresAt: string | null;
    };
}

interface Order {
    id: number;
    userId: number;
    currency: string;
    status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    type: 'PURCHASE' | 'TRIAL';
    initialPrice: number;
    totalPrice: number;
    promoCode: string | null;
    discount: number | null;
    paidAt: string | null;
    createdAt: string;
    expiresAt: string | null;
    orderProxies: OrderProxy[];
    payment?: any;
}

const ProfileOrders = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await api.orders.getMyOrders()
            setOrders(response)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders')
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    // Function to get status badge based on backend OrderStatus enum
    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">{t('profile.orders.status.active')}</span>;
            case 'EXPIRED':
                return <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">{t('profile.orders.status.expired')}</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">{t('profile.orders.status.cancelled')}</span>;
            case 'PENDING':
                return <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">{t('profile.orders.status.pending')}</span>;
            default:
                return null;
        }
    };

    // Function to handle renew button click
    const handleRenew = (orderId: number) => {
        console.log(`Renewing order: ${orderId}`);
        // Implement renewal logic
    };

    // Function to navigate to proxies filtered by order
    const handleViewProxies = (orderId: number) => {
        navigate({
            to: '/profile/proxies',
            search: { 
                orderId, 
                page: 1, 
                search: '', 
                status: 'all' 
            }
        })
    };

    // Function to handle continue payment
    const handleContinuePayment = (orderId: number) => {
        console.log(`Continue payment for order: ${orderId}`);
        // Implement payment continuation logic
        // For example, redirect to payment page or open payment modal
    };

    // Get country name from order proxies
    const getOrderCountry = (order: Order): string => {
        if (order.orderProxies.length > 0) {
            return order.orderProxies[0].proxy.proxyCountry.countryTicker;
        }
        return 'N/A';
    };

    // Get proxy count from order
    const getProxyCount = (order: Order): number => {
        return order.orderProxies.length;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500 dark:text-gray-400">Loading orders...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button 
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )
    }

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
                                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                                    <td className="px-4 py-3">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">{getProxyCount(order)}</td>
                                    <td className="px-4 py-3">{getOrderCountry(order)}</td>
                                    <td className="px-4 py-3">${order.totalPrice.toFixed(2)} {order.currency}</td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {getProxyCount(order) > 0 && (
                                                <button
                                                    onClick={() => handleViewProxies(order.id)}
                                                    className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors duration-200"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {t('profile.orders.actions.viewProxies')}
                                                </button>
                                            )}
                                            {order.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleRenew(order.id)}
                                                    className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs rounded transition-colors duration-200"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    {t('profile.orders.actions.renew')}
                                                </button>
                                            )}
                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleContinuePayment(order.id)}
                                                    className="inline-flex items-center px-2 py-1 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-xs rounded transition-colors duration-200"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {t('profile.orders.actions.continuePayment')}
                                                </button>
                                            )}
                                            {order.status === 'EXPIRED' && (
                                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {t('profile.orders.status.expired')}
                                                </span>
                                            )}
                                            {order.status === 'CANCELLED' && (
                                                <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    {t('profile.orders.status.cancelled')}
                                                </span>
                                            )}
                                        </div>
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