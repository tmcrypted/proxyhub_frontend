import { useProxiesStore } from './store'
import type { Proxy, AvailableProxyByCountry, Pricing } from './types'

// Основные селекторы
export const useProxies = () => useProxiesStore(state => state.proxies)
export const useAvailableProxiesByCountry = () => useProxiesStore(state => state.availableProxiesByCountry)
export const usePricing = () => useProxiesStore(state => state.pricing)
export const useProxiesLoading = () => useProxiesStore(state => state.isLoading)
export const useProxiesError = () => useProxiesStore(state => state.error)

// Действия
export const useSetProxies = () => useProxiesStore(state => state.setProxies)
export const useSetAvailableProxiesByCountry = () => useProxiesStore(state => state.setAvailableProxiesByCountry)
export const useSetPricing = () => useProxiesStore(state => state.setPricing)
export const useSetProxiesLoading = () => useProxiesStore(state => state.setLoading)
export const useSetProxiesError = () => useProxiesStore(state => state.setError)
export const useClearProxiesError = () => useProxiesStore(state => state.clearError)
export const useResetProxies = () => useProxiesStore(state => state.reset)

// Производные селекторы
export const useActiveProxies = () => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.proxyStatus === 'ACTIVE')
)

export const useProxiesByCountry = (countryId: number) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.countryId === countryId)
)

export const useProxiesByStatus = (status: string) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.proxyStatus === status)
)

export const useProxiesByType = (type: string) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.proxyType === type)
)

export const useProxiesByProtocol = (protocol: string) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.proxyProtocol === protocol)
)

export const useProxiesByUser = (userId: number) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.userId === userId)
)

export const useProxiesByBranch = (branchId: number) => useProxiesStore(state => 
  state.proxies.filter(proxy => proxy.branchId === branchId)
)

export const useProxyById = (id: number) => useProxiesStore(state => 
  state.proxies.find(proxy => proxy.id === id)
)

export const useAvailableProxiesCount = () => useProxiesStore(state => 
  state.availableProxiesByCountry.reduce((total, country) => total + country.count, 0)
)

export const useCountryById = (id: number) => useProxiesStore(state => 
  state.availableProxiesByCountry.find(country => country.id === id)
)

export const useCountryByName = (name: string) => useProxiesStore(state => 
  state.availableProxiesByCountry.find(country => country.name === name)
)

export const useCountryByCode = (code: string) => useProxiesStore(state => 
  state.availableProxiesByCountry.find(country => country.code === code)
)

// Селекторы для ценообразования
export const useDefaultPrice = () => useProxiesStore(state => state.pricing?.defaultPrice || 0)
export const useDiscountPercent = () => useProxiesStore(state => state.pricing?.discountPercent || 0)
export const useIsDiscountActive = () => useProxiesStore(state => state.pricing?.isDiscountActive || false)

// Селекторы для статистики
export const useProxiesStats = () => useProxiesStore(state => {
  const proxies = state.proxies
  const total = proxies.length
  const active = proxies.filter(p => p.proxyStatus === 'ACTIVE').length
  const inactive = proxies.filter(p => p.proxyStatus === 'INACTIVE').length
  const expired = proxies.filter(p => p.proxyStatus === 'EXPIRED').length
  
  return {
    total,
    active,
    inactive,
    expired,
    activePercentage: total > 0 ? (active / total) * 100 : 0
  }
})

export const useProxiesByCountryStats = () => useProxiesStore(state => {
  const proxies = state.proxies
  const countries = state.availableProxiesByCountry
  
  return countries.map(country => {
    const countryProxies = proxies.filter(p => p.countryId === country.id)
    const active = countryProxies.filter(p => p.proxyStatus === 'ACTIVE').length
    const total = countryProxies.length
    
    return {
      ...country,
      totalProxies: total,
      activeProxies: active,
      activePercentage: total > 0 ? (active / total) * 100 : 0
    }
  })
})