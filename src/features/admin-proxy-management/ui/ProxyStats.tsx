import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProxyStats, useHasProxies } from '../model/selectors'
import { BarChart3, Wifi, Users, Clock, Globe } from 'lucide-react'

export const ProxyStats = () => {
    const stats = useProxyStats()
    const hasProxies = useHasProxies()

    if (!hasProxies) {
        return null
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Proxies</CardTitle>
                    <Wifi className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-gray-500">
                        {stats.active} active, {stats.inactive} inactive
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Proxies</CardTitle>
                    <BarChart3 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    <p className="text-xs text-gray-500">
                        {((stats.active / stats.total) * 100).toFixed(1)}% of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assigned Proxies</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
                    <p className="text-xs text-gray-500">
                        {stats.unassigned} available
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expired Proxies</CardTitle>
                    <Clock className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                    <p className="text-xs text-gray-500">
                        {((stats.expired / stats.total) * 100).toFixed(1)}% of total
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 