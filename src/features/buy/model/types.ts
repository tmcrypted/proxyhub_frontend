import type { CountryInfo } from '@/features/proxy-management'
import type { OrderData, OrderResponse } from '@/features/order-management'
import type { PricingInfo } from '@/features/pricing'
import type { ModalState } from '@/features/modal'

export interface BuyFormData {
  country: string;
  quantity: number;
  promoCode: string;
}

// Re-export types from other features
export type { CountryInfo } from '@/features/proxy-management'
export type { OrderData, OrderResponse } from '@/features/order-management'
export type { PricingInfo } from '@/features/pricing'
export type { ModalState } from '@/features/modal' 