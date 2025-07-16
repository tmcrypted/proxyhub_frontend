import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import type { Proxy } from '../model/types'

interface ProxyTableProps {
    proxies: Proxy[]
    onEdit: (proxy: Proxy) => void
    onDelete: (id: number) => void
    onBulkUpdate?: (ids: number[], updates: Partial<Proxy>) => Promise<void>
    onBulkDelete?: (ids: number[]) => Promise<void>
}

export const ProxyTable = ({ proxies, onEdit, onDelete, onBulkUpdate, onBulkDelete }: ProxyTableProps) => {
    const { t } = useTranslation()
    const [showCredentials, setShowCredentials] = useState(false)
    const [selectedProxies, setSelectedProxies] = useState<Set<number>>(new Set())
    const [bulkStatus, setBulkStatus] = useState<Proxy['proxyStatus']>('ACTIVE')
    const [isBulkUpdating, setIsBulkUpdating] = useState(false)

    const getStatusBadge = (status: Proxy['proxyStatus']) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full whitespace-nowrap">Active</span>
            case 'INACTIVE':
                return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full whitespace-nowrap">Inactive</span>
            case 'EXPIRED':
                return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full whitespace-nowrap">Expired</span>
            default:
                return null
        }
    }

    const getProtocolBadge = (protocol: Proxy['proxyProtocol']) => {
        const colors = {
            HTTP: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
            HTTPS: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            SOCKS4: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
            SOCKS5: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400'
        }
        
        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colors[protocol]}`}>
                {protocol}
            </span>
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProxies(new Set(proxies.map(p => p.id)))
        } else {
            setSelectedProxies(new Set())
        }
    }

    const handleSelectProxy = (proxyId: number, checked: boolean) => {
        const newSelected = new Set(selectedProxies)
        if (checked) {
            newSelected.add(proxyId)
        } else {
            newSelected.delete(proxyId)
        }
        setSelectedProxies(newSelected)
    }

    const handleBulkUpdateStatus = async () => {
        if (selectedProxies.size === 0 || !onBulkUpdate) return
        
        setIsBulkUpdating(true)
        try {
            await onBulkUpdate(Array.from(selectedProxies), { proxyStatus: bulkStatus })
            setSelectedProxies(new Set())
        } catch (error) {
            console.error('Bulk update failed:', error)
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedProxies.size === 0 || !onBulkDelete) return
        
        if (!confirm(`Are you sure you want to delete ${selectedProxies.size} proxies?`)) return
        
        try {
            await onBulkDelete(Array.from(selectedProxies))
            setSelectedProxies(new Set())
        } catch (error) {
            console.error('Bulk delete failed:', error)
        }
    }

    const allSelected = proxies.length > 0 && selectedProxies.size === proxies.length
    const someSelected = selectedProxies.size > 0 && selectedProxies.size < proxies.length

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={allSelected}
                            ref={(el) => {
                                if (el && 'indeterminate' in el) {
                                    (el as HTMLInputElement).indeterminate = someSelected
                                }
                            }}
                            onCheckedChange={handleSelectAll}
                            className="h-5 w-5"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Select all
                        </span>
                    </div>
                    
                    {/* Bulk Actions */}
                    {selectedProxies.size > 0 && (
                        <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                            <span className="text-sm font-medium">
                                {selectedProxies.size} proxy{selectedProxies.size !== 1 ? 'ies' : ''} selected
                            </span>
                            <Select value={bulkStatus} onValueChange={(value: Proxy['proxyStatus']) => setBulkStatus(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                size="sm"
                                onClick={handleBulkUpdateStatus}
                                disabled={isBulkUpdating}
                            >
                                {isBulkUpdating ? 'Updating...' : 'Update Status'}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                Delete Selected
                            </Button>
                        </div>
                    )}
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                >
                    {showCredentials ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showCredentials ? 'Hide Credentials' : 'Show Credentials'}
                </Button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-h-[400px] transition-all duration-200">
                    {proxies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No proxies found
                        </div>
                    ) : (
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-3 py-2 font-medium w-12"></th>
                        <th className="px-3 py-2 font-medium w-16">ID</th>
                        <th className="px-3 py-2 font-medium w-32">IP:Port</th>
                        {showCredentials && (
                            <>
                                <th className="px-3 py-2 font-medium w-24">Login</th>
                                <th className="px-3 py-2 font-medium w-24">Password</th>
                            </>
                        )}
                        <th className="px-3 py-2 font-medium w-32">Country</th>
                        <th className="px-3 py-2 font-medium w-20">Status</th>
                        <th className="px-3 py-2 font-medium w-20">Protocol</th>
                        <th className="px-3 py-2 font-medium w-24">Type</th>
                        <th className="px-3 py-2 font-medium w-24">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {proxies.map((proxy) => (
                            <tr key={proxy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 h-12">
                                <td className="px-3 py-2 w-12">
                                    <Checkbox
                                        checked={selectedProxies.has(proxy.id)}
                                        onCheckedChange={(checked) => handleSelectProxy(proxy.id, checked as boolean)}
                                        className="h-5 w-5"
                                    />
                                </td>
                                <td className="px-3 py-2 text-sm font-medium w-16">#{proxy.id}</td>
                                <td className="px-3 py-2 w-32">
                                    <code className="text-sm font-mono truncate block">{proxy.ip}:{proxy.port}</code>
                                </td>
                                {showCredentials && (
                                    <>
                                        <td className="px-3 py-2 w-24">
                                            <code className="text-sm font-mono truncate block">{proxy.login}</code>
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <code className="text-sm font-mono truncate block">{proxy.password}</code>
                                        </td>
                                    </>
                                )}
                                <td className="px-3 py-2 w-32">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-medium truncate">{proxy.proxyCountry.countryTicker}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {proxy.proxyCountry.countryName}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-3 py-2 w-20">
                                    {getStatusBadge(proxy.proxyStatus)}
                                </td>
                                <td className="px-3 py-2 w-20">
                                    {getProtocolBadge(proxy.proxyProtocol)}
                                </td>
                                <td className="px-3 py-2 text-sm w-24">
                                    {proxy.proxyType}
                                </td>
                                <td className="px-3 py-2 w-24">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(proxy)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(proxy.id)}
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
        </div>
    )
} 