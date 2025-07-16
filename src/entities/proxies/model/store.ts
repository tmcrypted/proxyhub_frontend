import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  Proxy, 
  AvailableProxyByCountry, 
  Pricing, 
  GetUserProxiesParams,
  GetProxiesParams 
} from './types'

interface ProxiesState {
  // Состояние
  proxies: Proxy[]
  availableProxiesByCountry: AvailableProxyByCountry[]
  pricing: Pricing | null
  isLoading: boolean
  error: string | null
  
  // Действия
  setProxies: (proxies: Proxy[]) => void
  setAvailableProxiesByCountry: (proxies: AvailableProxyByCountry[]) => void
  setPricing: (pricing: Pricing) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  proxies: [],
  availableProxiesByCountry: [],
  pricing: null,
  isLoading: false,
  error: null,
}

export const useProxiesStore = create<ProxiesState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setProxies: (proxies) => set({ proxies }),
      
      setAvailableProxiesByCountry: (availableProxiesByCountry) => 
        set({ availableProxiesByCountry }),
      
      setPricing: (pricing) => set({ pricing }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'proxies-store',
    }
  )
) 