import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proxiesApi } from '../api/proxiesApi'
import { useProxiesStore } from '../model/store'
import type { GetProxiesParams, CreateProxyData, UpdateProxyData } from '../model/types'

// Ключи для кэширования
export const proxyKeys = {
  all: ['proxies'] as const,
  lists: () => [...proxyKeys.all, 'list'] as const,
  list: (params?: GetProxiesParams) => [...proxyKeys.lists(), params] as const,
  details: () => [...proxyKeys.all, 'detail'] as const,
  detail: (id: number) => [...proxyKeys.details(), id] as const,
  user: () => [...proxyKeys.all, 'user'] as const,
  available: () => [...proxyKeys.all, 'available'] as const,
  pricing: () => [...proxyKeys.all, 'pricing'] as const,
  pricingHistory: () => [...proxyKeys.all, 'pricing', 'history'] as const,
}

// Хук для получения всех прокси
export const useProxies = (params?: GetProxiesParams) => {
  const { setProxies, setLoading, setError, clearError } = useProxiesStore()
  
  return useQuery({
    queryKey: proxyKeys.list(params),
    queryFn: () => proxiesApi.getProxies(params),
    onSuccess: (data) => {
      setProxies(data)
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to fetch proxies')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Хук для получения прокси пользователя
export const useUserProxies = (orderId?: number) => {
  const { setProxies, setLoading, setError, clearError } = useProxiesStore()
  
  return useQuery({
    queryKey: [...proxyKeys.user(), orderId],
    queryFn: () => proxiesApi.getUserProxies({ orderId }),
    onSuccess: (data) => {
      setProxies(data)
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to fetch user proxies')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Хук для получения прокси по ID
export const useProxy = (id: number) => {
  return useQuery({
    queryKey: proxyKeys.detail(id),
    queryFn: () => proxiesApi.getProxyById(id),
    enabled: !!id,
  })
}

// Хук для получения доступных прокси по странам
export const useAvailableProxiesByCountry = () => {
  const { setAvailableProxiesByCountry, setLoading, setError, clearError } = useProxiesStore()
  
  return useQuery({
    queryKey: proxyKeys.available(),
    queryFn: () => proxiesApi.getAvailableProxiesByCountry(),
    onSuccess: (data) => {
      setAvailableProxiesByCountry(data)
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to fetch available proxies')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Хук для получения ценообразования
export const usePricing = () => {
  const { setPricing, setLoading, setError, clearError } = useProxiesStore()
  
  return useQuery({
    queryKey: proxyKeys.pricing(),
    queryFn: () => proxiesApi.getPricing(),
    onSuccess: (data) => {
      setPricing(data)
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to fetch pricing')
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

// Хук для получения истории ценообразования
export const usePricingHistory = () => {
  return useQuery({
    queryKey: proxyKeys.pricingHistory(),
    queryFn: () => proxiesApi.getPricingHistory(),
  })
}

// Мутации
export const useCreateProxy = () => {
  const queryClient = useQueryClient()
  const { setError, clearError } = useProxiesStore()
  
  return useMutation({
    mutationFn: (data: CreateProxyData) => proxiesApi.createProxy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to create proxy')
    },
  })
}

export const useUpdateProxy = () => {
  const queryClient = useQueryClient()
  const { setError, clearError } = useProxiesStore()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProxyData }) => 
      proxiesApi.updateProxy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to update proxy')
    },
  })
}

export const useDeleteProxy = () => {
  const queryClient = useQueryClient()
  const { setError, clearError } = useProxiesStore()
  
  return useMutation({
    mutationFn: (id: number) => proxiesApi.deleteProxy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to delete proxy')
    },
  })
}

export const useUpdatePricing = () => {
  const queryClient = useQueryClient()
  const { setError, clearError } = useProxiesStore()
  
  return useMutation({
    mutationFn: (data: Partial<{ defaultPrice: number; discountPercent: number; isDiscountActive: boolean }>) => 
      proxiesApi.updatePricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.pricing() })
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to update pricing')
    },
  })
}

export const useCreatePricing = () => {
  const queryClient = useQueryClient()
  const { setError, clearError } = useProxiesStore()
  
  return useMutation({
    mutationFn: (data: Omit<{ defaultPrice: number; discountPercent: number; isDiscountActive: boolean }, 'id' | 'createdAt' | 'updatedAt'>) => 
      proxiesApi.createPricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.pricing() })
      queryClient.invalidateQueries({ queryKey: proxyKeys.pricingHistory() })
      clearError()
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to create pricing')
    },
  })
} 