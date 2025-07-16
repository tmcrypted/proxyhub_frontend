import { useBuyProxiesStore } from './store'
import type { CountryInfo } from './types'

// Data selectors
export const useCountries = () => useBuyProxiesStore((state) => state.countries)
export const usePricing = () => useBuyProxiesStore((state) => state.pricing)
export const useLoading = () => useBuyProxiesStore((state) => state.loading)
export const useIsSubmitting = () => useBuyProxiesStore((state) => state.isSubmitting)

// Promo code selectors
export const usePromoApplied = () => useBuyProxiesStore((state) => state.promoApplied)
export const usePromoDiscount = () => useBuyProxiesStore((state) => state.promoDiscount)
export const useSliderKey = () => useBuyProxiesStore((state) => state.sliderKey)

// Modal selectors
export const useModal = () => useBuyProxiesStore((state) => state.modal)

// Computed selectors
export const useSelectedCountryInfo = (countryName: string) => {
  const countries = useCountries()
  return countries.find((country: CountryInfo) => country.name === countryName)
}

export const useCalculatePrice = (quantity: number) => {
  const pricing = usePricing()
  const promoApplied = usePromoApplied()
  const promoDiscount = usePromoDiscount()
  
  return () => {
    const basePrice = (pricing?.defaultPrice || 0) * quantity
    let discount = 0
    
    if (pricing?.isDiscountActive && pricing?.discountPercent > 0) {
      discount += basePrice * ((pricing?.discountPercent || 0) / 100)
    }
    
    if (promoApplied && promoDiscount > 0) {
      discount += basePrice * (promoDiscount / 100)
    }
    
    return basePrice - discount
  }
} 