import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, DollarSign, Eye, EyeOff } from 'lucide-react'
import type { Order } from '../model/types'

interface OrderTableProps {
    orders: Order[]
    onEdit: (order: Order) => void
    onDelete: (id: number) => void
    onMarkAsPaid: (id: number) => void
}

export const OrderTable = ({ orders, onEdit, onDelete, onMarkAsPaid }: OrderTableProps) => {
    const { t } = useTranslation()
    const [showProxies, setShowProxies] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const getStatusBadge = (status: Order['status']) => {
        const colors = {
            PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
            ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
            EXPIRED: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        }
        
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colors[status]}`}>
                {status}
            </span>
        )
    }

    const getTypeBadge = (type: Order['type']) => {
        const colors = {
            PURCHASE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
            TRIAL: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
        }
        
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colors[type]}`}>
                {type}
            </span>
        )
    }

    const getPaymentStatusBadge = (payment?: Order['payment']) => {
        if (!payment) {
            return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full whitespace-nowrap">No Payment</span>
        }

        const colors = {
            PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
            SUCCESS: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
            CANCELLED: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        }
        
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colors[payment.status]}`}>
                {payment.status}
            </span>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowProxies(!showProxies)}
                    >
                        {showProxies ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showProxies ? 'Hide Proxies' : 'Show Proxies'}
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-h-[400px] transition-all duration-200">
                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No orders found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-3 py-2 font-medium w-16">ID</th>
                                    <th className="px-3 py-2 font-medium">User</th>
                                    <th className="px-3 py-2 font-medium w-24">Status</th>
                                    <th className="px-3 py-2 font-medium w-24">Type</th>
                                    <th className="px-3 py-2 font-medium w-24">Payment</th>
                                    <th className="px-3 py-2 font-medium w-20">Price</th>
                                    <th className="px-3 py-2 font-medium w-20">Proxies</th>
                                    <th className="px-3 py-2 font-medium w-32">Created</th>
                                    <th className="px-3 py-2 font-medium w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 h-12">
                                        <td className="px-3 py-2 text-sm font-medium w-16">#{order.id}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {order.user.name || 'N/A'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            {getTypeBadge(order.type)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            {getPaymentStatusBadge(order.payment)}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-20">
                                            ${order.totalPrice}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-20">
                                            {order.orderProxies.length}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(order)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                {order.status === 'PENDING' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onMarkAsPaid(order.id)}
                                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDelete(order.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Proxy Details */}
            {showProxies && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Proxy Details</h4>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                                <h5 className="font-medium mb-2">Order #{order.id} - {order.orderProxies.length} proxies</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {order.orderProxies.map((orderProxy) => (
                                        <div key={orderProxy.id} className="border rounded p-3 text-sm">
                                            <div className="font-medium">{orderProxy.proxy.proxyCountry.countryName}</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                {orderProxy.proxy.ip}:{orderProxy.proxy.port}
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                {orderProxy.proxy.login}:{orderProxy.proxy.password}
                                            </div>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                                    orderProxy.proxy.proxyStatus === 'ACTIVE' 
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                }`}>
                                                    {orderProxy.proxy.proxyStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
} 