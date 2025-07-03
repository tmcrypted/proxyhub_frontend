import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { api } from '../../lib/api'
import { Eye, EyeOff, Copy, Download, CheckSquare, Square } from 'lucide-react'

// Debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    
    return debouncedValue
}

// Interface based on backend Proxy model structure
interface ProxyCountry {
    id: number;
    countryName: string;
    countryTicker: string;
}

interface OrderInfo {
    id: number;
    status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    type: 'PURCHASE' | 'TRIAL';
    totalPrice: number;
    currency: string;
    createdAt: string;
    expiresAt: string | null;
    paidAt: string | null;
}

interface OrderProxy {
    order: OrderInfo;
}

interface Proxy {
    id: number;
    ip: string;
    port: string;
    login: string;
    password: string;
    userId: number;
    proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    assignedAt: string | null;
    expiresAt: string | null;
    proxyCountry: ProxyCountry;
    orderProxies: OrderProxy[];
}

interface Order {
    id: number;
    createdAt: string;
    status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
}

const ITEMS_PER_PAGE = 20

const ProfileProxies = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const search = useSearch({ from: '/profile/proxies' })
    
    const [allProxies, setAllProxies] = useState<Proxy[]>([])
    const [displayedProxies, setDisplayedProxies] = useState<Proxy[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCredentials, setShowCredentials] = useState(false)
    const [selectedProxies, setSelectedProxies] = useState<Set<number>>(new Set())
    
    // Local state for search input (for immediate UI feedback)
    const [searchInput, setSearchInput] = useState(search.search || '')
    
    // Get values from URL search params
    const selectedOrderId = search.orderId
    const currentPage = search.page
    const searchTerm = search.search
    const statusFilter = search.status
    
    // Debounced search value
    const debouncedSearchTerm = useDebounce(searchInput, 500)
    
    // Functions to update URL search params
    const updateSearchParams = (newParams: Partial<typeof search>) => {
        navigate({
            to: '/profile/proxies',
            search: { ...search, ...newParams }
        })
    }
    
    const setSelectedOrderId = (orderId: number | undefined) => {
        updateSearchParams({ orderId, page: 1 }) // Reset to first page
    }
    
    const setCurrentPage = (page: number) => {
        updateSearchParams({ page })
    }
    
    const setSearchTerm = (searchValue: string) => {
        updateSearchParams({ search: searchValue, page: 1 }) // Reset to first page
    }
    
    const handleSearchInputChange = (searchValue: string) => {
        setSearchInput(searchValue)
    }
    
    const setStatusFilter = (status: string) => {
        updateSearchParams({ status, page: 1 }) // Reset to first page
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchProxies()
    }, [selectedOrderId])

    useEffect(() => {
        filterAndPaginateProxies()
    }, [allProxies, currentPage, searchTerm, statusFilter])

    // Initialize default values if URL params are empty
    useEffect(() => {
        if (currentPage === 1 && !searchTerm && statusFilter === 'all' && !selectedOrderId) {
            // URL params are at defaults, no need to update
            return
        }
        
        // If page is not set, set it to 1
        if (!currentPage) {
            setCurrentPage(1)
        }
    }, [])
    
    // Update URL when debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm) {
            setSearchTerm(debouncedSearchTerm)
        }
    }, [debouncedSearchTerm, searchTerm])
    
    // Update search input when URL search changes (for browser back/forward)
    useEffect(() => {
        setSearchInput(searchTerm || '')
    }, [searchTerm])

    const fetchData = async () => {
        try {
            // Загружаем заказы для фильтра
            const ordersResponse = await api.orders.getMyOrders()
            setOrders(ordersResponse)
            
            // Загружаем прокси
            await fetchProxies()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data')
            console.error('Error fetching data:', err)
        }
    }

    const fetchProxies = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await api.proxies.getMyProxies(selectedOrderId)
            setAllProxies(response)
            // Don't reset current page here - let the URL parameter handling do it
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch proxies')
            console.error('Error fetching proxies:', err)
        } finally {
            setLoading(false)
        }
    }

    const filterAndPaginateProxies = () => {
        let filtered = allProxies

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(proxy => 
                proxy.ip.includes(searchTerm) ||
                proxy.proxyCountry.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proxy.proxyCountry.countryTicker.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(proxy => proxy.proxyStatus === statusFilter.toUpperCase())
        }

        // Paginate
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        setDisplayedProxies(filtered.slice(startIndex, endIndex))
    }

    const getTotalPages = () => {
        let filtered = allProxies

        if (searchTerm) {
            filtered = filtered.filter(proxy => 
                proxy.ip.includes(searchTerm) ||
                proxy.proxyCountry.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proxy.proxyCountry.countryTicker.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(proxy => proxy.proxyStatus === statusFilter.toUpperCase())
        }

        return Math.ceil(filtered.length / ITEMS_PER_PAGE)
    }

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text)
            // You could add a toast notification here
            console.log(`${type} copied to clipboard`)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getStatusBadge = (status: Proxy['proxyStatus']) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">Active</span>;
            case 'EXPIRED':
                return <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">Expired</span>;
            case 'INACTIVE':
                return <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">Inactive</span>;
            default:
                return null;
        }
    }

    const formatProxyString = (proxy: Proxy) => {
        return `${proxy.ip}:${proxy.port}:${proxy.login}:${proxy.password}`
    }

    const handleSelectProxy = (proxyId: number) => {
        const newSelected = new Set(selectedProxies)
        if (newSelected.has(proxyId)) {
            newSelected.delete(proxyId)
        } else {
            newSelected.add(proxyId)
        }
        setSelectedProxies(newSelected)
    }

    const handleSelectAll = () => {
        if (selectedProxies.size === displayedProxies.length) {
            setSelectedProxies(new Set())
        } else {
            setSelectedProxies(new Set(displayedProxies.map(p => p.id)))
        }
    }

    const handleBulkCopy = () => {
        const selectedProxyData = allProxies
            .filter(proxy => selectedProxies.has(proxy.id))
            .map(proxy => formatProxyString(proxy))
            .join('\n')
        
        copyToClipboard(selectedProxyData, 'Selected proxies')
    }

    const exportSelectedProxies = () => {
        const selectedProxyData = allProxies
            .filter(proxy => selectedProxies.has(proxy.id))
            .map(proxy => formatProxyString(proxy))
            .join('\n')
        
        const blob = new Blob([selectedProxyData], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'proxies.txt'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    if (loading && allProxies.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500 dark:text-gray-400">Loading proxies...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button 
                    onClick={fetchData}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )
    }

    const totalPages = getTotalPages()

    return (
        <div>
            {/* Header with title and actions */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{t('profile.proxies.title')}</h3>
                
                {selectedProxies.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedProxies.size} {t('profile.proxies.selected')}
                        </span>
                        <button
                            onClick={handleBulkCopy}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            {t('profile.proxies.copySelected')}
                        </button>
                        <button
                            onClick={exportSelectedProxies}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {t('profile.proxies.export')}
                        </button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.proxies.filterByOrder')}:
                    </label>
                    <select
                        value={selectedOrderId || ''}
                        onChange={(e) => setSelectedOrderId(e.target.value ? Number(e.target.value) : undefined)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                    >
                        <option value="">{t('profile.proxies.allOrders')}</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>
                                #{order.id} - {new Date(order.createdAt).toLocaleDateString()} ({order.status})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.proxies.search')}:
                    </label>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        placeholder={t('profile.proxies.searchPlaceholder')}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                        {t('profile.proxies.status')}:
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                    >
                        <option value="all">{t('profile.proxies.allStatuses')}</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>

                <button
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                    {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCredentials ? t('profile.proxies.hideCredentials') : t('profile.proxies.showCredentials')}
                </button>
            </div>
            
            {allProxies.length > 0 ? (
                <>
                    {/* Table view for better scalability */}
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={handleSelectAll}
                                            className="flex items-center"
                                        >
                                            {selectedProxies.size === displayedProxies.length && displayedProxies.length > 0 ? 
                                                <CheckSquare className="w-4 h-4" /> : 
                                                <Square className="w-4 h-4" />
                                            }
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.country')}</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.endpoint')}</th>
                                    {showCredentials && (
                                        <>
                                            <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.login')}</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.password')}</th>
                                        </>
                                    )}
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.status')}</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.expires')}</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.order')}</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">{t('profile.proxies.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {displayedProxies.map((proxy) => (
                                    <tr key={proxy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleSelectProxy(proxy.id)}
                                                className="flex items-center"
                                            >
                                                {selectedProxies.has(proxy.id) ? 
                                                    <CheckSquare className="w-4 h-4 text-blue-500" /> : 
                                                    <Square className="w-4 h-4" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{proxy.proxyCountry.countryTicker}</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {proxy.proxyCountry.countryName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-sm font-mono">{proxy.ip}:{proxy.port}</code>
                                        </td>
                                        {showCredentials && (
                                            <>
                                                <td className="px-4 py-3">
                                                    <code className="text-sm font-mono">{proxy.login}</code>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="text-sm font-mono">{proxy.password}</code>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-4 py-3">
                                            {getStatusBadge(proxy.proxyStatus)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {proxy.expiresAt ? 
                                                new Date(proxy.expiresAt).toLocaleDateString() : 
                                                '-'
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {proxy.orderProxies.length > 0 ? (
                                                <span className="font-medium">#{proxy.orderProxies[0].order.id}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => copyToClipboard(formatProxyString(proxy), 'Proxy credentials')}
                                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {(() => {
                                    let filtered = allProxies
                                    
                                    if (searchTerm) {
                                        filtered = filtered.filter(proxy => 
                                            proxy.ip.includes(searchTerm) ||
                                            proxy.proxyCountry.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            proxy.proxyCountry.countryTicker.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                    }
                                    
                                    if (statusFilter !== 'all') {
                                        filtered = filtered.filter(proxy => proxy.proxyStatus === statusFilter.toUpperCase())
                                    }
                                    
                                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
                                    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)
                                    
                                    return `${t('profile.proxies.showing')} ${startIndex} - ${endIndex} ${t('profile.proxies.of')} ${filtered.length}`
                                })()}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {t('profile.proxies.previous')}
                                </button>
                                
                                <span className="px-3 py-1">
                                    {currentPage} {t('profile.proxies.of')} {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {t('profile.proxies.next')}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">{t('profile.proxies.empty')}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        {t('profile.proxies.buyProxies')}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileProxies 