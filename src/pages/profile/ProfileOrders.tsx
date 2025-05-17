import { useState } from 'react'

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
                return <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">Active</span>;
            case 'expired':
                return <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">Expired</span>;
            case 'cancelled':
                return <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">Cancelled</span>;
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
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b">Orders</h3>
            
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div 
                            key={order.id} 
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-medium">Order #{order.id}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Purchased on {new Date(order.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>{getStatusBadge(order.status)}</div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Proxies</p>
                                    <p>{order.proxies} {order.country} Proxies</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                                    <p>${order.amount.toFixed(2)}</p>
                                </div>
                                {order.expiresAt && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expires</p>
                                        <p>{new Date(order.expiresAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    View Details
                                </button>
                                {order.status === 'active' && (
                                    <button 
                                        onClick={() => handleRenew(order.id)}
                                        className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Renew
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        Buy Proxies
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileOrders 