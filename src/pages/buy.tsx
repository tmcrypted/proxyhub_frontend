import z from 'zod'
import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useAppForm } from '../hooks/demo.form'


interface CountryInfo {
  id: number;
  name: string;
  code: string;
  count: number;
}

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  promoCode: z.string(),
})

import { config, urlHelpers } from '../config'
import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

function SimpleForm() {
  const { user, isAuthenticated } = useAuthStore()
  const form = useAppForm({
    defaultValues: {
      country: '',
      quantity: 1,
      promoCode: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true)
        
        // Проверить аутентификацию
        if (!isAuthenticated) {
          showModal('error', 'Authentication Required', 'Please log in to create an order.')
          return
        }

        // Найти ID страны по названию
        const selectedCountry = countries.find(country => country.name === value.country)
        if (!selectedCountry) {
          showModal('error', 'Invalid Selection', 'Please select a valid country.')
          return
        }

        // Создать заказ через API
        const orderData = {
          countryId: selectedCountry.id,
          proxyCount: value.quantity,
          promoCode: value.promoCode?.trim() || undefined
        }

        const order = await api.orders.create(orderData)
        console.log('Order created:', order)
        
        // Обновить данные после успешного создания заказа
        await fetchData(false) // false = не показывать лоадер
        
        // Сбросить промокод после успешного заказа
        setPromoApplied(false)
        setPromoDiscount(0)
        form.setFieldValue('promoCode', '')
        
        showModal('success', 'Order Created Successfully!', 
          `Your order has been created and proxies have been reserved.`, 
          order.id, 
          order.totalPrice)
      } catch (error) {
        console.error('Error creating order:', error)
        
        // Более детальная обработка ошибок
        let errorMessage = 'Error creating order. Please try again.'
        if (error instanceof Error) {
          if (error.message.includes('Not enough proxies')) {
            errorMessage = 'Not enough proxies available for the selected country. Please choose fewer proxies or select a different country.'
          } else if (error.message.includes('Country with ID')) {
            errorMessage = 'Selected country is invalid. Please refresh the page and try again.'
          } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
            errorMessage = 'Please log in to create an order.'
          } else if (error.message.includes('Argument') && error.message.includes('missing')) {
            errorMessage = 'Authentication error. Please log out and log in again.'
          }
        }
        
        showModal('error', 'Order Creation Failed', errorMessage)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [pricing, setPricing] = useState({
    defaultPrice: 0,
    discountPercent: 0,
    isDiscountActive: false
  })
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [sliderKey, setSliderKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
    orderId?: number
    totalPrice?: number
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      // Fetch countries
      const countriesResponse = await fetch(`${config.api.baseUrl}/proxies/available/by-country`)
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json()
        setCountries(countriesData)
        
        // Сохранить текущую выбранную страну
        const currentCountry = form.getFieldValue('country')
        const currentCountryStillExists = countriesData.find((c: CountryInfo) => c.name === currentCountry)
        
        if (!currentCountry && countriesData.length > 0) {
          form.setFieldValue('country', countriesData[0].name)
        } else if (currentCountry && !currentCountryStillExists) {
          // Если выбранной страны больше нет в списке, выбираем первую доступную
          if (countriesData.length > 0) {
            form.setFieldValue('country', countriesData[0].name)
          }
        }
        
        // Обновить количество, если превышает доступное
        const selectedCountry = countriesData.find((c: CountryInfo) => c.name === form.getFieldValue('country'))
        if (selectedCountry) {
          const currentQuantity = form.getFieldValue('quantity')
          if (currentQuantity > selectedCountry.count) {
            form.setFieldValue('quantity', Math.min(currentQuantity, selectedCountry.count))
          }
          // Force slider to re-render
          setSliderKey(prev => prev + 1)
        }
      }

      // Fetch pricing
      const pricingResponse = await fetch(`${config.api.baseUrl}/pricing`)
      if (pricingResponse.ok) {
        const pricingData = await pricingResponse.json()
        setPricing({
          defaultPrice: pricingData.defaultPrice || pricingData.default_price || 0,
          discountPercent: pricingData.discountPercent || pricingData.discount_percent || 0,
          isDiscountActive: pricingData.isDiscountActive || pricingData.is_discount_active || false
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getSelectedCountryInfo = () => {
    return countries.find(country => country.name === form.getFieldValue('country'))
  }

  const calculatePrice = () => {
    const basePrice = (pricing?.defaultPrice || 0) * form.getFieldValue('quantity')
    let discount = 0
    
    if (pricing?.isDiscountActive && pricing?.discountPercent > 0) {
      discount += basePrice * ((pricing?.discountPercent || 0) / 100)
    }
    
    if (promoApplied && promoDiscount > 0) {
      discount += basePrice * (promoDiscount / 100)
    }
    
    return basePrice - discount
  }

  const applyPromoCode = async () => {
    const promoCode = form.getFieldValue('promoCode')
    if (!promoCode?.trim()) return
    
    try {
      // Simulate API call for promo code validation
      await new Promise(resolve => setTimeout(resolve, 500))
      setPromoDiscount(10) // 10% additional discount
      setPromoApplied(true)
    } catch (error) {
      console.error('Error applying promo code:', error)
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  const getFlagImageUrl = (countryCode: string, size: number = 48): string => {
    return urlHelpers.getFlagUrl(countryCode, size)
  }

  const showModal = (type: 'success' | 'error', title: string, message: string, orderId?: number, totalPrice?: number) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      orderId,
      totalPrice
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  // Закрытие модалки по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal()
      }
    }

    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [modal.isOpen])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Buy Private IPV4 Proxies</h2>
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Please log in to purchase proxies
              </p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Buy Private IPV4 Proxies</h2>
          
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.AppField name="country">
              {(field) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Country
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(countryName) => {
                      field.handleChange(countryName)
                      // Reset quantity when country changes
                      const selectedCountry = countries.find(c => c.name === countryName)
                      const currentQuantity = form.getFieldValue('quantity')
                      if (selectedCountry) {
                        if (currentQuantity > selectedCountry.count) {
                          form.setFieldValue('quantity', Math.min(currentQuantity, selectedCountry.count))
                        }
                        // Ensure quantity is at least 1
                        if (currentQuantity < 1) {
                          form.setFieldValue('quantity', 1)
                        }
                        // Force slider to re-render
                        setSliderKey(prev => prev + 1)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      {field.state.value && (
                        <SelectValue>
                          <div className="flex items-center">
                            <img 
                              src={getFlagImageUrl(countries.find(c => c.name === field.state.value)?.code || '', 64)} 
                              alt={`${field.state.value} flag`} 
                              className="w-6 h-4 mr-3 object-cover" 
                            />
                            <span>{field.state.value}</span>
                          </div>
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem 
                          key={country.name} 
                          value={country.name} 
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-3 py-2"
                        >
                          <div className="flex items-center justify-between w-full min-w-0">
                            <div className="flex items-center min-w-0 flex-1">
                              <img 
                                src={getFlagImageUrl(country.code, 48)} 
                                alt={`${country.name} flag`} 
                                className="w-5 h-3 mr-3 flex-shrink-0 object-cover" 
                              />
                              <span className="truncate">{country.name}</span>
                            </div>
                            <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full text-xs ml-3 flex-shrink-0">
                              {country.count}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>

            <form.AppField name="quantity">
              {(field) => {
                const currentSelectedCountryInfo = countries.find(country => country.name === form.getFieldValue('country'))
                
                if (!currentSelectedCountryInfo) return null
                
                return (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="1"
                        max={currentSelectedCountryInfo.count}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      />
                      <div className="flex-1">
                        <Slider 
                          key={`slider-${currentSelectedCountryInfo.name}-${currentSelectedCountryInfo.count}-${sliderKey}`}
                          value={[field.state.value]}
                          min={1}
                          max={currentSelectedCountryInfo.count}
                          step={1}
                          onValueChange={(value) => field.handleChange(value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                          <span>1</span>
                          <span>{currentSelectedCountryInfo.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            </form.AppField>

            <div className="space-y-4">
              <form.AppField name="promoCode">
                {(field) => (
                  <div className="space-y-2">
                    {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Promo Code
                    </label> */}
                    <div className="flex">
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-grow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={applyPromoCode}
                        disabled={promoApplied || !field.state.value?.trim()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-r-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">Promo code applied!</p>
                    )}
                  </div>
                )}
              </form.AppField>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Price per proxy:</span>
                  <span>${pricing?.defaultPrice?.toFixed(2) || "0.00"}</span>
                </div>
                
                {pricing.isDiscountActive && pricing.discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount:</span>
                    <span>-{pricing.discountPercent}%</span>
                  </div>
                )}
                
                {promoApplied && promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Promo discount:</span>
                    <span>-{promoDiscount}%</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 text-gray-800 dark:text-gray-100">
                  <span>Total:</span>
                  <span>${calculatePrice()?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubscribeButton 
                  label={isSubmitting ? "Processing..." : "Buy Now"}
                />
              </form.AppForm>
            </div>
          </form>

          {/* Modal */}
          {modal.isOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-4">
                  {modal.type === 'success' ? (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                    {modal.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {modal.message}
                </p>
                
                {modal.type === 'success' && modal.orderId && modal.totalPrice && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">#{modal.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Price:</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">${modal.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      modal.type === 'success'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {modal.type === 'success' ? 'Continue Shopping' : 'Try Again'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const BuyForm = (parentRoute: RootRoute) =>
  createRoute({
    path: '/buy',
    component: SimpleForm,
    getParentRoute: () => parentRoute,
  })
