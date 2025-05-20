import { createRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

import { useAppForm } from '../hooks/demo.form'

import type { RootRoute } from '@tanstack/react-router'

interface CountryInfo {
  name: string;
  code: string;
  count: number;
}

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  promoCode: z.string(),
})

const API_BASE_URL = 'http://localhost:3030'

function SimpleForm() {
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Form submitted:', value)
        alert('Proxies purchased successfully!')
      } catch (error) {
        console.error('Error purchasing proxies:', error)
        alert('Error purchasing proxies. Please try again.')
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch countries
        const countriesResponse = await fetch(`${API_BASE_URL}/proxies/available/by-country`)
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json()
          setCountries(countriesData)
          if (countriesData.length > 0) {
            form.setFieldValue('country', countriesData[0].name)
          }
        }

        // Fetch pricing
        const pricingResponse = await fetch(`${API_BASE_URL}/pricing`)
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
        setLoading(false)
      }
    }

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
    return `https://flagsapi.com/${countryCode}/flat/${size}.png`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )
  }

  const selectedCountryInfo = getSelectedCountryInfo()

  return (

    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="flex flex-row items-center justify-center flex-wrap">
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
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      {field.state.value && (
                        <SelectValue>
                          <div className="flex items-center">
                            <img 
                              src={getFlagImageUrl(countries.find(c => c.name === field.state.value)?.code || '', 32)} 
                              alt={`${field.state.value} flag`} 
                              className="w-8 h-auto mr-3 rounded-sm shadow-sm" 
                            />
                            <span>{field.state.value}</span>
                          </div>
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <img 
                                src={getFlagImageUrl(country.code, 24)} 
                                alt={`${country.name} flag`} 
                                className="w-6 h-auto mr-3 rounded-sm shadow-sm" 
                              />
                              <span>{country.name}</span>
                            </div>
                            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 rounded-full text-sm">{country.count}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>

            {selectedCountryInfo && (
              <form.AppField name="quantity">
                {(field) => (
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
                        className="w-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      />
                      <div className="flex-1">
                        <Slider 
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
              </form.AppField>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <form.AppField name="promoCode">
                {(field) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Promo Code
                    </label>
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
                  label="Buy Now"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
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
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      {field.state.value && (
                        <SelectValue>
                          <div className="flex items-center">
                            <img 
                              src={getFlagImageUrl(countries.find(c => c.name === field.state.value)?.code || '', 32)} 
                              alt={`${field.state.value} flag`} 
                              className="w-8 h-auto mr-3 rounded-sm shadow-sm" 
                            />
                            <span>{field.state.value}</span>
                          </div>
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <img 
                                src={getFlagImageUrl(country.code, 24)} 
                                alt={`${country.name} flag`} 
                                className="w-6 h-auto mr-3 rounded-sm shadow-sm" 
                              />
                              <span>{country.name}</span>
                            </div>
                            <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 rounded-full text-sm">{country.count}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>

            {selectedCountryInfo && (
              <form.AppField name="quantity">
                {(field) => (
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
                        className="w-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      />
                      <div className="flex-1">
                        <Slider 
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
              </form.AppField>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <form.AppField name="promoCode">
                {(field) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Promo Code
                    </label>
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
                  label="Buy Now"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/demo/form/simple',
    component: SimpleForm,
    getParentRoute: () => parentRoute,
  })
