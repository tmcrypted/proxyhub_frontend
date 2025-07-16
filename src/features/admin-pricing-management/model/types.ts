export interface Pricing {
  id: number
  defaultPrice: number
  discountPercent: number | null
  isDiscountActive: boolean
  discountStartDate: string | null
  discountEndDate: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdatePricingData {
  defaultPrice?: number
  discountPercent?: number
  isDiscountActive?: boolean
  discountStartDate?: string
  discountEndDate?: string
} 