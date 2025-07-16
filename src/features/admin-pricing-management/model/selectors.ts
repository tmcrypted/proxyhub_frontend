import { usePricingStore } from './store'
import type { Pricing } from './types'

export const useCurrentPricing = (): Pricing | null => {
  return usePricingStore((state) => state.currentPricing)
}

export const useLoading = (): boolean => {
  return usePricingStore((state) => state.loading)
}

export const useError = (): string | null => {
  return usePricingStore((state) => state.error)
} 