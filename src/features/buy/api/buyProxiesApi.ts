import { proxiesApi } from '@/entities/proxies/api'
import { ordersApi } from '@/entities/orders/api'
import type { CountryInfo, PricingInfo, OrderData, OrderResponse } from '../model/types'

export const buyProxiesApi = {
  getAvailableCountries: async (): Promise<CountryInfo[]> => {
    return proxiesApi.getAvailableProxiesByCountry()
  },

  getPricing: async (): Promise<PricingInfo> => {
    return proxiesApi.getPricing()
  },

  createOrder: async (orderData: OrderData): Promise<OrderResponse> => {
    return ordersApi.createOrder(orderData)
  },

  applyPromoCode: async (promoCode: string): Promise<{ discount: number }> => {
    // Используем API для применения промокода
    return fetch('/api/pricing/apply-promo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promoCode }),
    }).then(res => res.json())
  }
} 