import z from 'zod'
import { RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'

import { useAuthStore } from '@/shared/api/authStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select'
import { Slider } from '@/shared/components/ui/slider'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { useBuyProxiesStore } from '../model/store'
import { useCountries, usePricing, useLoading, useIsSubmitting, usePromoApplied, usePromoDiscount, useSliderKey, useSelectedCountryInfo, useCalculatePrice } from '../model/selectors'
import { buyProxiesApi } from '../api/buyProxiesApi'
import { getFlagImageUrl, getErrorMessage } from '../lib/utils'
import { useModalStore } from '@/shared/stores/modalStore'
import type { BuyFormData } from '../model/types'

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  promoCode: z.string(),
})

export function BuyProxiesForm() {
  const { user, isAuthenticated } = useAuthStore()
  const { showModal } = useModalStore()
  
  // Store actions
  const {
    setCountries,
    setPricing,
    setLoading,
    setIsSubmitting,
    setPromoApplied,
    setPromoDiscount,
    incrementSliderKey,
    resetPromo
  } = useBuyProxiesStore()
  
  // Store selectors
  const countries = useCountries()
  const pricing = usePricing()
  const loading = useLoading()
  const isSubmitting = useIsSubmitting()
  const promoApplied = usePromoApplied()
  const promoDiscount = usePromoDiscount()
  const sliderKey = useSliderKey()

  const form = useForm({
    defaultValues: {
      country: '',
      quantity: 1,
      promoCode: '',
    },
    onSubmit: async ({ value }: { value: BuyFormData }) => {
      console.log('Form onSubmit called with value:', value)
      
      // Проверить аутентификацию
      if (!isAuthenticated) {
        showModal({
          type: 'error',
          title: 'Authentication Required',
          message: 'Please log in to create an order.'
        })
        return
      }

      // Проверить роль пользователя
      if (user?.role === 'ADMIN') {
        showModal({
          type: 'error',
          title: 'Access Denied',
          message: 'Administrators cannot create orders.'
        })
        return
      }

      // Найти ID страны по названию
      const selectedCountry = countries.find(country => country.name === value.country)
      if (!selectedCountry) {
        showModal({
          type: 'error',
          title: 'Invalid Selection',
          message: 'Please select a valid country.'
        })
        return
      }

      // Показать окно подтверждения
      const totalPrice = calculatePrice()
      const pricePerProxy = pricing?.defaultPrice || 0
      
      showModal({
        type: 'confirm',
        title: 'Confirm Purchase',
        message: 'Please review your order details before confirming the purchase.',
        data: {
          orderDetails: {
            country: value.country,
            quantity: value.quantity,
            pricePerProxy: pricePerProxy,
            totalPrice: totalPrice
          }
        },
        onConfirm: async () => {
          try {
            // Создать заказ через API
            const orderData = {
              countryId: selectedCountry.id,
              proxyCount: value.quantity,
              promoCode: value.promoCode?.trim() || undefined
            }

            const order = await buyProxiesApi.createOrder(orderData)
            console.log('Order created:', order)
            console.log('Order type:', typeof order)
            console.log('Order keys:', Object.keys(order || {}))
            console.log('Order.id:', order?.id)
            console.log('Order.totalPrice:', order?.totalPrice)
            console.log('Order stringified:', JSON.stringify(order, null, 2))
            
            // Проверяем, что order существует и имеет необходимые поля
            if (!order) {
              throw new Error('Order creation failed: no response received')
            }
            
            if (typeof order.id === 'undefined') {
              console.error('Order response missing id:', order)
              throw new Error('Order creation failed: missing order ID')
            }
            
            if (typeof order.totalPrice === 'undefined') {
              console.error('Order response missing totalPrice:', order)
              throw new Error('Order creation failed: missing total price')
            }
            
            // Обновить данные после успешного создания заказа
            await fetchData(false) // false = не показывать лоадер
            
            // Сбросить промокод после успешного заказа
            resetPromo()
            form.setFieldValue('promoCode', '')
            
            showModal({
              type: 'success',
              title: 'Order Created Successfully!',
              message: 'Your order has been created and proxies have been reserved.',
              data: {
                orderId: order.id,
                totalPrice: order.totalPrice
              }
            })
          } catch (error) {
            console.error('Error creating order:', error)
            const errorMessage = getErrorMessage(error)
            showModal({
              type: 'error',
              title: 'Order Creation Failed',
              message: errorMessage
            })
            throw error // Перебрасываем ошибку, чтобы модальное окно знало о ней
          }
        },
        onCancel: () => {
          // Просто закрыть модальное окно
        }
      })
    },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
  })

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      // Fetch countries
      const countriesData = await buyProxiesApi.getAvailableCountries()
      setCountries(countriesData)
      
      // Сохранить текущую выбранную страну
      const currentCountry = form.getFieldValue('country')
      const currentCountryStillExists = countriesData.find((c) => c.name === currentCountry)
      
      if (!currentCountry && countriesData.length > 0) {
        form.setFieldValue('country', countriesData[0].name)
      } else if (currentCountry && !currentCountryStillExists) {
        // Если выбранной страны больше нет в списке, выбираем первую доступную
        if (countriesData.length > 0) {
          form.setFieldValue('country', countriesData[0].name)
        }
      }
      
      // Обновить количество, если превышает доступное
      const selectedCountry = countriesData.find((c) => c.name === form.getFieldValue('country'))
      if (selectedCountry) {
        const currentQuantity = form.getFieldValue('quantity')
        if (currentQuantity > selectedCountry.count) {
          form.setFieldValue('quantity', Math.min(currentQuantity, selectedCountry.count))
        }
        // Force slider to re-render
        incrementSliderKey()
      }

      // Fetch pricing
      const pricingData = await buyProxiesApi.getPricing()
      setPricing(pricingData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const applyPromoCode = async () => {
    const promoCode = form.getFieldValue('promoCode')
    if (!promoCode?.trim()) return
    
    try {
      const result = await buyProxiesApi.applyPromoCode(promoCode)
      setPromoDiscount(result.discount)
      setPromoApplied(true)
    } catch (error) {
      console.error('Error applying promo code:', error)
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  const calculatePrice = useCalculatePrice(form.getFieldValue('quantity'))
  
  // Get selected country info at the top level
  const selectedCountryInfo = useSelectedCountryInfo(form.getFieldValue('country'))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto w-full">
        <CardHeader>
          <CardTitle>Buy Private IPV4 Proxies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Please log in to purchase proxies
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Проверяем, является ли пользователь админом
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4 py-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Buy Private IPV4 Proxies</CardTitle>
        </CardHeader>
        <CardContent>
          {isAdmin && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <AlertDescription>
                As an administrator, you cannot create orders through this interface. Please use the admin panel to manage proxies and orders.
              </AlertDescription>
            </Alert>
          )}
          
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Form submitted, calling form.handleSubmit()')
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name="country"
              children={(field) => (
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
                        incrementSliderKey()
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
            />

            {selectedCountryInfo && (
              <form.Field
                name="quantity"
                children={(field) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="1"
                        max={selectedCountryInfo.count}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        className="w-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      />
                      <div className="flex-1">
                        <Slider 
                          key={`slider-${selectedCountryInfo.name}-${selectedCountryInfo.count}-${sliderKey}`}
                          value={[field.state.value]}
                          min={1}
                          max={selectedCountryInfo.count}
                          step={1}
                          onValueChange={(value) => field.handleChange(value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                          <span>1</span>
                          <span>{selectedCountryInfo.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            )}

            {/* Отображение цены */}
            <div className="mt-4 space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Price per proxy:</span>
                <span>${pricing?.defaultPrice?.toFixed(2) || "0.00"}</span>
              </div>
              
              {pricing?.isDiscountActive && pricing.discountPercent > 0 && (
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

            <div className="flex justify-end">
              {!isAdmin ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    console.log('Buy button clicked')
                    form.handleSubmit()
                  }}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting ? "Processing..." : "Buy Now"}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Purchase functionality is not available for administrators
                  </p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 