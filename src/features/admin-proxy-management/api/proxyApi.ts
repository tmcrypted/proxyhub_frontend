import { apiClient } from '@/shared/api/apiClient'
import type { Proxy, CreateProxyData, UpdateProxyData, ProxyFilters, BatchCreateProxyData } from '../model/types'

export const proxyApi = {
  // Получить все прокси с фильтрами
  async getAll(filters?: ProxyFilters): Promise<Proxy[]> {
    const params = new URLSearchParams()
    if (filters?.branchId) params.append('branchId', filters.branchId.toString())
    if (filters?.userId) params.append('userId', filters.userId.toString())
    
    const queryString = params.toString()
    const url = queryString ? `/proxies?${queryString}` : '/proxies'
    const response = await apiClient.get<Proxy[]>(url)
    return response.data
  },

  // Получить прокси по ID
  async getById(id: number): Promise<Proxy | null> {
    const response = await apiClient.get<Proxy>(`/proxies/${id}`)
    return response.data
  },

  // Создать новый прокси
  async create(data: CreateProxyData): Promise<Proxy> {
    const response = await apiClient.post<Proxy>('/proxies', data)
    return response.data
  },

  // Создать прокси батчем
  async createBatch(data: BatchCreateProxyData): Promise<{ created: number; errors: string[] }> {
    const response = await apiClient.post<{ created: number; errors: string[] }>('/proxies/batch', data)
    return response.data
  },

  // Обновить прокси
  async update(id: number, data: UpdateProxyData): Promise<Proxy> {
    const response = await apiClient.patch<Proxy>(`/proxies/${id}`, data)
    return response.data
  },

  // Удалить прокси
  async delete(id: number): Promise<Proxy> {
    const response = await apiClient.delete<Proxy>(`/proxies/${id}`)
    return response.data
  },

  // Массовое обновление прокси
  async bulkUpdate(ids: number[], updates: any): Promise<void> {
    await apiClient.patch('/proxies/bulk', { ids, updates })
  },

  // Массовое удаление прокси
  async bulkDelete(ids: number[]): Promise<void> {
    await apiClient.deleteWithBody('/proxies/bulk', { ids })
  },

  // Получить доступные прокси по странам
  async getAvailableByCountry(): Promise<Array<{ id: number; name: string; code: string; count: number }>> {
    const response = await apiClient.get<Array<{ id: number; name: string; code: string; count: number }>>('/proxies/available/by-country')
    return response.data
  }
} 