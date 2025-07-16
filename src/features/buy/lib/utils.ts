import { urlHelpers } from '@/shared/config'

export const getFlagImageUrl = (countryCode: string, size: number = 48): string => {
  return urlHelpers.getFlagUrl(countryCode, size)
}

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

export const calculateDiscount = (basePrice: number, discountPercent: number): number => {
  return basePrice * (discountPercent / 100)
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message
    
    if (message.includes('Not enough proxies')) {
      return 'Not enough proxies available for the selected country. Please choose fewer proxies or select a different country.'
    } else if (message.includes('Country with ID')) {
      return 'Selected country is invalid. Please refresh the page and try again.'
    } else if (message.includes('unauthorized') || message.includes('401')) {
      return 'Please log in to create an order.'
    } else if (message.includes('Argument') && message.includes('missing')) {
      return 'Authentication error. Please log out and log in again.'
    }
    
    return message
  }
  
  return 'Error creating order. Please try again.'
} 