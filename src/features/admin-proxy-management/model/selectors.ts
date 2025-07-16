import { useProxyStore } from './store'
import type { Proxy, ProxyFilters } from './types'

// Базовые селекторы
export const useProxies = () => useProxyStore(state => state.proxies)
export const useLoading = () => useProxyStore(state => state.loading)
export const useError = () => useProxyStore(state => state.error)
export const useFilters = () => useProxyStore(state => state.filters)
export const useCurrentPage = () => useProxyStore(state => state.currentPage)
export const useItemsPerPage = () => useProxyStore(state => state.itemsPerPage)

// Производные селекторы
export const useFilteredProxies = () => {
  const proxies = useProxies()
  const filters = useFilters()
  
  return proxies.filter(proxy => {
    if (filters.branchId && proxy.branchId !== filters.branchId) return false
    if (filters.userId && proxy.userId !== filters.userId) return false
    if (filters.countryId && proxy.countryId !== filters.countryId) return false
    if (filters.proxyStatus && proxy.proxyStatus !== filters.proxyStatus) return false
    if (filters.proxyType && proxy.proxyType !== filters.proxyType) return false
    if (filters.proxyProtocol && proxy.proxyProtocol !== filters.proxyProtocol) return false
    return true
  })
}

export const useProxiesByStatus = (status: Proxy['proxyStatus']) => {
  const proxies = useProxies()
  return proxies.filter(proxy => proxy.proxyStatus === status)
}

export const useProxiesByCountry = (countryId: number) => {
  const proxies = useProxies()
  return proxies.filter(proxy => proxy.countryId === countryId)
}

export const useProxiesByUser = (userId: number) => {
  const proxies = useProxies()
  return proxies.filter(proxy => proxy.userId === userId)
}

export const useActiveProxies = () => useProxiesByStatus('ACTIVE')
export const useInactiveProxies = () => useProxiesByStatus('INACTIVE')
export const useExpiredProxies = () => useProxiesByStatus('EXPIRED')

// Статистика
export const useProxyStats = () => {
  const proxies = useProxies()
  
  return {
    total: proxies.length,
    active: proxies.filter(p => p.proxyStatus === 'ACTIVE').length,
    inactive: proxies.filter(p => p.proxyStatus === 'INACTIVE').length,
    expired: proxies.filter(p => p.proxyStatus === 'EXPIRED').length,
    residential: proxies.filter(p => p.proxyType === 'RESIDENTIAL').length,
    datacenter: proxies.filter(p => p.proxyType === 'DATACENTER').length,
    assigned: proxies.filter(p => p.userId !== null).length,
    unassigned: proxies.filter(p => p.userId === null).length
  }
}

// Поиск прокси
export const useProxyById = (id: number) => {
  const proxies = useProxies()
  return proxies.find(proxy => proxy.id === id)
}

// Пагинация
export const usePaginatedProxies = () => {
  const proxies = useFilteredProxies()
  const currentPage = useCurrentPage()
  const itemsPerPage = useItemsPerPage()
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  return proxies.slice(startIndex, endIndex)
}

export const usePaginationInfo = () => {
  const proxies = useFilteredProxies()
  const currentPage = useCurrentPage()
  const itemsPerPage = useItemsPerPage()
  
  const totalItems = proxies.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems)
  }
}

// Проверки
export const useHasProxies = () => {
  const proxies = useProxies()
  return proxies.length > 0
}

export const useHasActiveProxies = () => {
  const activeProxies = useActiveProxies()
  return activeProxies.length > 0
}

// Подсчет активных фильтров
export const useActiveFiltersCount = () => {
  const filters = useFilters()
  
  let count = 0
  if (filters.branchId) count++
  if (filters.userId) count++
  if (filters.countryId) count++
  if (filters.proxyStatus) count++
  if (filters.proxyType) count++
  if (filters.proxyProtocol) count++
  
  return count
} 