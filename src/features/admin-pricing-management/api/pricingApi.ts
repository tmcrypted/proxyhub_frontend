import { api } from '@/lib/api'
import type { Pricing, UpdatePricingData } from '../model/types'

export const pricingApi = {
  // Get current pricing
  getCurrentPricing: async (): Promise<Pricing> => {
    const response = await api.get('/pricing')
    return response
  },

  // Update current pricing (admin only)
  updatePricing: async (data: UpdatePricingData): Promise<Pricing> => {
    const response = await api.patch('/pricing', data)
    return response
  }
} 