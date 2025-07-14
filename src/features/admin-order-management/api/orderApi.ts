import { api } from '../../../lib/api'
import type { Order, UpdateOrderData } from '../model/types'

export const orderApi = {
  // Получить все заказы (только для админов)
  getAll: (): Promise<Order[]> => {
    return api.get('/orders')
  },

  // Получить заказы пользователя
  getByUserId: (userId: number): Promise<Order[]> => {
    return api.get(`/orders?userId=${userId}`)
  },

  // Получить заказ по ID
  getById: (id: number): Promise<Order | null> => {
    return api.get(`/orders/${id}`)
  },

  // Обновить заказ
  update: (id: number, data: UpdateOrderData): Promise<Order> => {
    return api.patch(`/orders/${id}`, data)
  },

  // Удалить заказ
  delete: (id: number): Promise<Order> => {
    return api.delete(`/orders/${id}`)
  },

  // Отметить заказ как оплаченный
  markAsPaid: (id: number): Promise<Order> => {
    return api.patch(`/orders/${id}/mark-paid`)
  }
} 