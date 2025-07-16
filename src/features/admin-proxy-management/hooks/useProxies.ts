import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/apiClient'
import type { Proxy, CreateProxyData, UpdateProxyData, ProxyFilters, BatchCreateProxyData } from '../model/types'

// Query keys
export const proxyKeys = {
  all: ['proxies'] as const,
  lists: () => [...proxyKeys.all, 'list'] as const,
  list: (filters: ProxyFilters) => [...proxyKeys.lists(), filters] as const,
  details: () => [...proxyKeys.all, 'detail'] as const,
  detail: (id: number) => [...proxyKeys.details(), id] as const,
  availableByCountry: () => [...proxyKeys.all, 'available-by-country'] as const,
}

// Hook for fetching all proxies with filters
export function useProxies(filters?: ProxyFilters) {
  const params = new URLSearchParams()
  if (filters?.branchId) params.append('branchId', filters.branchId.toString())
  if (filters?.userId) params.append('userId', filters.userId.toString())
  
  const queryString = params.toString()
  const url = queryString ? `/proxies?${queryString}` : '/proxies'
  
  return useQuery({
    queryKey: proxyKeys.list(filters || {}),
    queryFn: async () => {
      const response = await apiClient.get<Proxy[]>(url)
      return response
    }
  })
}

// Hook for fetching single proxy
export function useProxy(id: number) {
  return useQuery({
    queryKey: proxyKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Proxy>(`/proxies/${id}`)
      return response
    },
    enabled: !!id
  })
}

// Hook for creating proxy
export function useCreateProxy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateProxyData) => {
      const response = await apiClient.post<Proxy>('/proxies', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
    }
  })
}

// Hook for creating proxies in batch
export function useCreateProxiesBatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: BatchCreateProxyData) => {
      const response = await apiClient.post<{ created: number; errors: string[] }>('/proxies/batch', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
    }
  })
}

// Hook for updating proxy
export function useUpdateProxy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProxyData }) => {
      const response = await apiClient.patch<Proxy>(`/proxies/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: proxyKeys.details() })
    }
  })
}

// Hook for deleting proxy
export function useDeleteProxy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete<Proxy>(`/proxies/${id}`)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
    }
  })
}

// Hook for bulk updating proxies
export function useBulkUpdateProxies() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ ids, updates }: { ids: number[]; updates: any }) => {
      await apiClient.patch('/proxies/bulk', { ids, updates })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
    }
  })
}

// Hook for bulk deleting proxies
export function useBulkDeleteProxies() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await apiClient.deleteWithBody('/proxies/bulk', { ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyKeys.lists() })
    }
  })
}

// Hook for fetching available proxies by country
export function useAvailableProxiesByCountry() {
  return useQuery({
    queryKey: proxyKeys.availableByCountry(),
    queryFn: async () => {
      const response = await apiClient.get<Array<{ id: number; name: string; code: string; count: number }>>('/proxies/available/by-country')
      return response
    }
  })
} 