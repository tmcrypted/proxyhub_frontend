import { create } from 'zustand'
import { pricingApi } from '../api/pricingApi'
import type { Pricing, UpdatePricingData } from './types'

interface PricingState {
  currentPricing: Pricing | null
  loading: boolean
  error: string | null
}

interface PricingActions {
  fetchCurrentPricing: () => Promise<void>
  updatePricing: (data: UpdatePricingData) => Promise<void>
  reset: () => void
}

type PricingStore = PricingState & PricingActions

const initialState: PricingState = {
  currentPricing: null,
  loading: false,
  error: null,
}

export const usePricingStore = create<PricingStore>((set, get) => ({
  ...initialState,

  fetchCurrentPricing: async () => {
    set({ loading: true, error: null })
    try {
      const pricing = await pricingApi.getCurrentPricing()
      set({ currentPricing: pricing, loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch current pricing', 
        loading: false 
      })
    }
  },

  updatePricing: async (data: UpdatePricingData) => {
    set({ loading: true, error: null })
    try {
      const updatedPricing = await pricingApi.updatePricing(data)
      set({ 
        currentPricing: updatedPricing,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update pricing', 
        loading: false 
      })
      throw error
    }
  },

  reset: () => {
    set(initialState)
  },
})) 