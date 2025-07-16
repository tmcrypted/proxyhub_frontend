import { create } from 'zustand'
import type { CountryInfo, PricingInfo, ModalState } from './types'

interface BuyProxiesState {
  // Data
  countries: CountryInfo[]
  pricing: PricingInfo
  loading: boolean
  isSubmitting: boolean
  
  // Promo code
  promoApplied: boolean
  promoDiscount: number
  sliderKey: number
  
  // Actions
  setCountries: (countries: CountryInfo[]) => void
  setPricing: (pricing: PricingInfo) => void
  setLoading: (loading: boolean) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setPromoApplied: (applied: boolean) => void
  setPromoDiscount: (discount: number) => void
  incrementSliderKey: () => void
  resetPromo: () => void
}

export const useBuyProxiesStore = create<BuyProxiesState>((set, _get) => ({
  // Initial state
  countries: [],
  pricing: {
    defaultPrice: 0,
    discountPercent: 0,
    isDiscountActive: false
  },
  loading: true,
  isSubmitting: false,
  promoApplied: false,
  promoDiscount: 0,
  sliderKey: 0,
  
  // Actions
  setCountries: (countries) => set({ countries }),
  setPricing: (pricing) => set({ pricing }),
  setLoading: (loading) => set({ loading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setPromoApplied: (promoApplied) => set({ promoApplied }),
  setPromoDiscount: (promoDiscount) => set({ promoDiscount }),
  incrementSliderKey: () => set((state) => ({ sliderKey: state.sliderKey + 1 })),
  
  resetPromo: () => set({
    promoApplied: false,
    promoDiscount: 0
  })
})) 