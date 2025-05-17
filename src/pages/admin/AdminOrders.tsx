import { useState } from 'react'
import { Search, Eye, User, RefreshCw, Wallet, CheckCircle, XCircle } from 'lucide-react'

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    date: string;
    proxies: number;
    country: string;
    amount: number;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    expiresAt?: string;
    paymentMethod: 'wallet' | 'crypto' | 'card';
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'ord-123456',
            userId: 'usr-1',
            userEmail: 'user1@example.com',
            date: '2023-06-10',
            proxies: 5,
            country: 'US',
            amount: 45,
            status: 'active',
            expiresAt: '2023-07-10',
            paymentMethod: 'wallet'
        },
        {
            id: 'ord-789012',
            userId: 'usr-2',
            userEmail: 'user2@example.com',
            date: '2023-05-15',
            proxies: 3,
            country: 'UK',
            amount: 30,
            status: 'expired',
            expiresAt: '2023-06-15',
            paymentMethod: 'crypto'
        },
        {
            id: 'ord-345678',
            userId: 'usr-4',
            userEmail: 'suspended@example.com',
            date: '2023-04-20',
            proxies: 2,
            country: 'CA',
            amount: 20,
            status: 'cancelled',
            paymentMethod: 'card'
        },
        {
            id: 'ord-901234',
            userId: 'usr-1',
            userEmail: 'user1@example.com',
            date: '2023-06-18',
            proxies: 1,
            country: 'DE',
            amount: 12,
            status: 'pending',
            paymentMethod: 'wallet'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'cancelled' | 'pending'>('all');
    const [countryFilter, setCountryFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

    // Get unique countries for filter
    const uniqueCountries = Array.from(new Set(orders.map(order => order.country)));

    // Filter orders
    const filteredOrders = orders.filter(order => {
        // Filter by search term
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by status
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        // Filter by country
        const matchesCountry = countryFilter === 'all' || order.country === countryFilter;
        
        return matchesSearch && matchesStatus && matchesCountry;
    });

    // Status badge component
    const StatusBadge = ({ status }: { status: Order['status'] }) => {
        let bgColor = '';
        
        switch (status) {
            case 'active':
                bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
                break;
            case 'expired':
                bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
                break;
            case 'cancelled':
                bgColor = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
                break;
            case 'pending':
                bgColor = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
                break;
            default:
                bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Payment method badge
    const PaymentMethodBadge = ({ method }: { method: Order['paymentMethod'] }) => {
        let bgColor = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        let icon = null;
        
        switch (method) {
            case 'wallet':
                bgColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
                icon = <Wallet className="w-3 h-3 mr-1" />;
                break;
            case 'crypto':
                bgColor = 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
                icon = <img src="/crypto-icon.svg" className="w-3 h-3 mr-1" alt="" />;
                break;
            case 'card':
                bgColor = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
                icon = <img src="/card-icon.svg" className="w-3 h-3 mr-1" alt="" />;
                break;
        }
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full flex items-center ${bgColor}`}>
                {icon}
                {method.charAt(0).toUpperCase() + method.slice(1)}
            </span>
        );
    };

    // Handle view order details
    const handleViewOrder = (orderId: string) => {
        console.log(`View order details for ${orderId}`);
        // Navigate to order detail page or show modal
    };

    // Handle view user details
    const handleViewUser = (userId: string) => {
        console.log(`View user details for ${userId}`);
        // Navigate to user detail page or show modal
    };

    // Handle approve order
    const handleApproveOrder = (orderId: string) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'active' } : order
            ));
            setIsLoading(false);
        }, 600);
    };

    // Handle cancel order
    const handleCancelOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setOrders(orders.map(order => 
                    order.id === orderId ? { ...order, status: 'cancelled' } : order
                ));
                setIsLoading(false);
            }, 600);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">Order Management</h3>

            {/* Filter and search controls */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by order ID or user email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    />
                </div>
                
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                
                <div>
                    <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    >
                        <option value="all">All Countries</option>
                        {uniqueCountries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Orders table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Proxies</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-sm">
                                        {order.id}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="truncate max-w-[150px]">
                                            {order.userEmail}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {order.proxies} {order.country}
                                </td>
                                <td className="px-4 py-3">
                                    ${order.amount.toFixed(2)}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <PaymentMethodBadge method={order.paymentMethod} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleViewOrder(order.id)}
                                            title="View Order Details"
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleViewUser(order.userId)}
                                            title="View User"
                                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                        >
                                            <User className="w-4 h-4" />
                                        </button>
                                        
                                        {order.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleApproveOrder(order.id)}
                                                    disabled={isLoading}
                                                    title="Approve Order"
                                                    className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                                                >
                                                    {isLoading ? 
                                                        <RefreshCw className="w-4 h-4 animate-spin" /> : 
                                                        <CheckCircle className="w-4 h-4" />
                                                    }
                                                </button>
                                                <button 
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    disabled={isLoading}
                                                    title="Cancel Order"
                                                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                >
                                                    {isLoading ? 
                                                        <RefreshCw className="w-4 h-4 animate-spin" /> : 
                                                        <XCircle className="w-4 h-4" />
                                                    }
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-4">
                        <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders; 