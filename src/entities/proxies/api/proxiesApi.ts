import { apiClient } from '@/shared/api/apiClient'
import type { 
  Proxy, 
  AvailableProxyByCountry, 
  Pricing,
  GetUserProxiesParams,
  GetProxiesParams,
  CreateProxyData,
  UpdateProxyData
} from '../model/types'

export const proxiesApi = {
  // Получение всех прокси
  async getProxies(params?: GetProxiesParams): Promise<Proxy[]> {
    const queryParams = new URLSearchParams()
    if (params?.branchId) queryParams.append('branchId', params.branchId.toString())
    if (params?.userId) queryParams.append('userId', params.userId.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/proxies?${queryString}` : '/proxies'
    
    return apiClient.get<Proxy[]>(url)
  },

  // Получение прокси пользователя
  async getUserProxies(params?: GetUserProxiesParams): Promise<Proxy[]> {
    const queryParams = new URLSearchParams()
    if (params?.orderId) queryParams.append('orderId', params.orderId.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/proxies/my?${queryString}` : '/proxies/my'
    
    return apiClient.get<Proxy[]>(url)
  },

  // Получение прокси по ID
  async getProxyById(id: number): Promise<Proxy> {
    return apiClient.get<Proxy>(`/proxies/${id}`)
  },

  // Создание прокси
  async createProxy(data: CreateProxyData): Promise<Proxy> {
    return apiClient.post<Proxy>('/proxies', data)
  },

  // Обновление прокси
  async updateProxy(id: number, data: UpdateProxyData): Promise<Proxy> {
    return apiClient.patch<Proxy>(`/proxies/${id}`, data)
  },

  // Удаление прокси
  async deleteProxy(id: number): Promise<Proxy> {
    return apiClient.delete<Proxy>(`/proxies/${id}`)
  },

  // Получение доступных прокси по странам
  async getAvailableProxiesByCountry(): Promise<AvailableProxyByCountry[]> {
    return apiClient.get<AvailableProxyByCountry[]>('/proxies/available/by-country')
  },

  // Получение текущего ценообразования
  async getPricing(): Promise<Pricing> {
    return apiClient.get<Pricing>('/pricing')
  },

  // Получение истории ценообразования (только для админов)
  async getPricingHistory(): Promise<Pricing[]> {
    return apiClient.get<Pricing[]>('/pricing/history')
  },

  // Обновление ценообразования (только для админов)
  async updatePricing(data: Partial<Pricing>): Promise<Pricing> {
    return apiClient.patch<Pricing>('/pricing', data)
  },

  // Создание нового ценообразования (только для админов)
  async createPricing(data: Omit<Pricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pricing> {
    return apiClient.post<Pricing>('/pricing', data)
  }
} 