import { apiClient } from '@/shared/api/apiClient'
import type { Order, UpdateOrderData } from '../model/types'

export const orderApi = {
  // Получить все заказы (только для админов)
  getAll: (): Promise<Order[]> => {
    return apiClient.get('/orders')
  },

  // Получить заказы пользователя
  getByUserId: (userId: number): Promise<Order[]> => {
    return apiClient.get(`/orders?userId=${userId}`)
  },

  // Получить заказ по ID
  getById: (id: number): Promise<Order | null> => {
    return apiClient.get(`/orders/${id}`)
  },

  // Обновить заказ
  update: (id: number, data: UpdateOrderData): Promise<Order> => {
    return apiClient.patch(`/orders/${id}`, data)
  },

  // Удалить заказ
  delete: (id: number): Promise<Order> => {
    return apiClient.delete(`/orders/${id}`)
  },

  // Отметить заказ как оплаченный
  markAsPaid: (id: number): Promise<Order> => {
    return apiClient.patch(`/orders/${id}/mark-paid`)
  }
} 