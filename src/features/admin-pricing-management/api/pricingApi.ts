import { apiClient } from '@/shared/api/apiClient'
import type { Pricing, UpdatePricingData } from '../model/types'

export const pricingApi = {
  // Получить все цены
  getAll: (): Promise<Pricing[]> => {
    return apiClient.get('/pricing')
  },

  // Получить текущую цену
  getCurrentPricing: (): Promise<Pricing> => {
    return apiClient.get('/pricing')
  },

  // Получить цену по ID
  getById: (id: number): Promise<Pricing | null> => {
    return apiClient.get(`/pricing/${id}`)
  },

  // Обновить цену
  update: (id: number, data: UpdatePricingData): Promise<Pricing> => {
    return apiClient.patch(`/pricing/${id}`, data)
  },

  // Применить промокод
  applyPromoCode: async (promoCode: string): Promise<{ discount: number }> => {
    return apiClient.post('/pricing/apply-promo', { promoCode })
  }
} 