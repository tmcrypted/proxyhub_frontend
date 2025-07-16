import { create } from 'zustand'
import { proxyApi } from '../api/proxyApi'
import type { Proxy, ProxyFilters, CreateProxyData, UpdateProxyData, BatchCreateProxyData } from './types'

interface ProxyState {
  // State
  proxies: Proxy[]
  loading: boolean
  error: string | null
  filters: ProxyFilters
  currentPage: number
  itemsPerPage: number
  
  // Actions
  fetchProxies: (filters?: ProxyFilters) => Promise<void>
  createProxy: (data: CreateProxyData) => Promise<void>
  createBatchProxies: (data: BatchCreateProxyData) => Promise<{ created: number; errors: string[] }>
  generateQuickBatch: (count: number, countryId?: number) => Promise<{ created: number; errors: string[] }>
  bulkUpdateProxies: (ids: number[], updates: Partial<UpdateProxyData>) => Promise<void>
  bulkDeleteProxies: (ids: number[]) => Promise<void>
  updateProxy: (id: number, data: UpdateProxyData) => Promise<void>
  deleteProxy: (id: number) => Promise<void>
  setFilters: (filters: ProxyFilters) => void
  setPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  clearError: () => void
}

export const useProxyStore = create<ProxyState>((set, get) => ({
  // Initial state
  proxies: [],
  loading: false,
  error: null,
  filters: {},
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  fetchProxies: async (filters?: ProxyFilters) => {
    try {
      set({ loading: true, error: null })
      const data = await proxyApi.getAll(filters || get().filters)
      set({ proxies: data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch proxies'
      set({ error: errorMessage, loading: false })
      console.error('Error fetching proxies:', error)
    }
  },

  createProxy: async (data: CreateProxyData) => {
    try {
      set({ loading: true, error: null })
      await proxyApi.create(data)
      await get().fetchProxies()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create proxy'
      set({ error: errorMessage, loading: false })
      console.error('Error creating proxy:', error)
      throw error
    }
  },

  createBatchProxies: async (data: BatchCreateProxyData) => {
    try {
      set({ loading: true, error: null })
      const result = await proxyApi.createBatch(data)
      await get().fetchProxies()
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create batch proxies'
      set({ error: errorMessage, loading: false })
      console.error('Error creating batch proxies:', error)
      throw error
    }
  },

  generateQuickBatch: async (count: number, countryId: number = 1) => {
    try {
      set({ loading: true, error: null })
      
      // Генерируем тестовые прокси
      const proxies = []
      for (let i = 1; i <= count; i++) {
        const ip = `192.168.${Math.floor(i / 255) + 1}.${(i % 255) + 1}`
        const port = '8080'
        const login = `user${i}`
        const password = `pass${i}`
        proxies.push({ ip, port, login, password })
      }

      const batchData: BatchCreateProxyData = {
        proxyStatus: 'ACTIVE',
        countryId,
        proxyType: 'RESIDENTIAL',
        proxyFormat: 'USERNAME_PASSWORD',
        proxyProtocol: 'HTTP',
        proxies
      }

      const result = await proxyApi.createBatch(batchData)
      await get().fetchProxies()
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate quick batch'
      set({ error: errorMessage, loading: false })
      console.error('Error generating quick batch:', error)
      throw error
    }
  },

  bulkUpdateProxies: async (ids: number[], updates: Partial<UpdateProxyData>) => {
    try {
      set({ loading: true, error: null })
      await proxyApi.bulkUpdate(ids, updates)
      await get().fetchProxies()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk update proxies'
      set({ error: errorMessage, loading: false })
      console.error('Error bulk updating proxies:', error)
      throw error
    }
  },

  bulkDeleteProxies: async (ids: number[]) => {
    try {
      set({ loading: true, error: null })
      await proxyApi.bulkDelete(ids)
      await get().fetchProxies()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk delete proxies'
      set({ error: errorMessage, loading: false })
      console.error('Error bulk deleting proxies:', error)
      throw error
    }
  },

  updateProxy: async (id: number, data: UpdateProxyData) => {
    try {
      set({ loading: true, error: null })
      await proxyApi.update(id, data)
      await get().fetchProxies()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update proxy'
      set({ error: errorMessage, loading: false })
      console.error('Error updating proxy:', error)
      throw error
    }
  },

  deleteProxy: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await proxyApi.delete(id)
      await get().fetchProxies()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete proxy'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting proxy:', error)
    }
  },

  setFilters: (filters: ProxyFilters) => {
    set({ filters })
  },

  setPage: (page: number) => {
    set({ currentPage: page })
  },

  setItemsPerPage: (itemsPerPage: number) => {
    set({ itemsPerPage, currentPage: 1 })
  },

  clearError: () => {
    set({ error: null })
  }
})) 