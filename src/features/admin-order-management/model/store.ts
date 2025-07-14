import { create } from 'zustand'
import { orderApi } from '../api/orderApi'
import type { Order, UpdateOrderData } from './types'

interface OrderState {
  // State
  orders: Order[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchOrders: () => Promise<void>
  updateOrder: (id: number, data: UpdateOrderData) => Promise<void>
  deleteOrder: (id: number) => Promise<void>
  markOrderAsPaid: (id: number) => Promise<void>
  clearError: () => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  orders: [],
  loading: false,
  error: null,

  // Actions
  fetchOrders: async () => {
    try {
      set({ loading: true, error: null })
      const data = await orderApi.getAll()
      set({ orders: data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders'
      set({ error: errorMessage, loading: false })
      console.error('Error fetching orders:', error)
    }
  },

  updateOrder: async (id: number, data: UpdateOrderData) => {
    try {
      set({ loading: true, error: null })
      await orderApi.update(id, data)
      await get().fetchOrders()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order'
      set({ error: errorMessage, loading: false })
      console.error('Error updating order:', error)
      throw error
    }
  },

  deleteOrder: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await orderApi.delete(id)
      await get().fetchOrders()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete order'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting order:', error)
      throw error
    }
  },

  markOrderAsPaid: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await orderApi.markAsPaid(id)
      await get().fetchOrders()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark order as paid'
      set({ error: errorMessage, loading: false })
      console.error('Error marking order as paid:', error)
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 