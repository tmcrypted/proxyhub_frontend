import { api } from '../../../lib/api'
import type { Proxy, CreateProxyData, UpdateProxyData, ProxyFilters, BatchCreateProxyData } from '../model/types'

export const proxyApi = {
  // Получить все прокси с фильтрами
  getAll: (filters?: ProxyFilters): Promise<Proxy[]> => {
    const params = new URLSearchParams()
    if (filters?.branchId) params.append('branchId', filters.branchId.toString())
    if (filters?.userId) params.append('userId', filters.userId.toString())
    
    const queryString = params.toString()
    const url = queryString ? `/proxies?${queryString}` : '/proxies'
    return api.get(url)
  },

  // Получить прокси по ID
  getById: (id: number): Promise<Proxy | null> => {
    return api.get(`/proxies/${id}`)
  },

  // Создать новый прокси
  create: (data: CreateProxyData): Promise<Proxy> => {
    return api.post('/proxies', data)
  },

  // Создать прокси батчем
  createBatch: (data: BatchCreateProxyData): Promise<{ created: number; errors: string[] }> => {
    return api.post('/proxies/batch', data)
  },

  // Обновить прокси
  update: (id: number, data: UpdateProxyData): Promise<Proxy> => {
    return api.patch(`/proxies/${id}`, data)
  },

  // Удалить прокси
  delete: (id: number): Promise<Proxy> => {
    return api.delete(`/proxies/${id}`)
  },

  // Массовое обновление прокси
  bulkUpdate: (ids: number[], updates: any): Promise<void> => {
    return api.patch('/proxies/bulk', { ids, updates })
  },

  // Массовое удаление прокси
  bulkDelete: (ids: number[]): Promise<void> => {
    return api.deleteWithBody('/proxies/bulk', { ids })
  },

  // Получить доступные прокси по странам
  getAvailableByCountry: (): Promise<Array<{ id: number; name: string; code: string; count: number }>> => {
    return api.get('/proxies/available/by-country')
  }
} 