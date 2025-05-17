import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import './slider-styles.css'

interface CountryInfo {
  name: string;
  code: string;
  count: number;
}

interface Pricing {
  defaultPrice: number
  discountPercent: number
  isDiscountActive: boolean
}

const API_BASE_URL = 'http://localhost:3030'; // Backend server URL

const Proxies = () => {
  const [countries, setCountries] = useState<CountryInfo[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [pricing, setPricing] = useState<Pricing>({ defaultPrice: 0, discountPercent: 0, isDiscountActive: false })
  const [loading, setLoading] = useState<boolean>(true)
  const [promoCode, setPromoCode] = useState<string>('')
  const [promoApplied, setPromoApplied] = useState<boolean>(false)
  const [promoDiscount, setPromoDiscount] = useState<number>(0)

  useEffect(() => {
    // Fetch available proxies by country
    const fetchProxies = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/proxies/available/by-country`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
          
          // Set first country as default if there are countries
          if (data.length > 0) {
            setSelectedCountry(data[0].name);
          }
        } else if (response.status !== 304) {
          console.error('Error fetching proxies:', response.statusText);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching proxies:', error);
        setLoading(false);
      }
    }

    // Fetch current pricing
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pricing`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Handle possible snake_case response from API
          setPricing({
            defaultPrice: data.defaultPrice || data.default_price || 0,
            discountPercent: data.discountPercent || data.discount_percent || 0,
            isDiscountActive: data.isDiscountActive || data.is_discount_active || false
          });
        } else if (response.status !== 304) {
          console.error('Error fetching pricing:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      }
    }

    fetchProxies();
    fetchPricing();
  }, [])

  // Find the selected country object
  const getSelectedCountryInfo = () => {
    return countries.find(country => country.name === selectedCountry);
  }

  // Handle country selection
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName)
    // Reset quantity to 1 or max available
    setQuantity(1)
  }

  // Handle promo code input change
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value)
    // Reset promo application when changing the code
    if (promoApplied) {
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return
    
    try {
      // Here you would implement the actual API call to validate the promo code
      // For now, we'll just simulate a successful promo code application
      // In a real app, replace this with an actual API request
      
      // Simulated API call response
      const simulatedDiscount = 10 // 10% additional discount
      
      setPromoDiscount(simulatedDiscount)
      setPromoApplied(true)
    } catch (error) {
      console.error('Error applying promo code:', error)
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  // Calculate total price
  const calculatePrice = () => {
    const basePrice = (pricing?.defaultPrice || 0) * quantity
    let discount = 0
    
    // Apply regular discount
    if (pricing?.isDiscountActive && pricing?.discountPercent > 0) {
      discount += basePrice * ((pricing?.discountPercent || 0) / 100)
    }
    
    // Apply promo code discount if valid
    if (promoApplied && promoDiscount > 0) {
      discount += basePrice * (promoDiscount / 100)
    }
    
    return basePrice - discount
  }

  // Handle quantity change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    const selectedCountryInfo = getSelectedCountryInfo();
    const maxAvailable = selectedCountryInfo?.count || 0
    
    if (value > 0 && value <= maxAvailable) {
      setQuantity(value)
    }
  }

  // Handle slider quantity change
  const handleSliderChange = (value: number[]) => {
    const selectedCountryInfo = getSelectedCountryInfo();
    const maxAvailable = selectedCountryInfo?.count || 0
    
    if (value[0] > 0 && value[0] <= maxAvailable) {
      setQuantity(value[0])
    }
  }

  // Handle buy button click
  const handleBuy = () => {
    // Implement purchase logic here
    console.log('Buying', quantity, 'proxies from', selectedCountry, 'for $', calculatePrice())
  }

  // Get Flag Image URL 
  const getFlagImageUrl = (countryCode: string, size: number = 48): string => {
    return `https://flagsapi.com/${countryCode}/flat/${size}.png`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )
  }

  const selectedCountryInfo = getSelectedCountryInfo();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Buy Private IPV4 Proxies</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Select Country</h3>
        
        {/* Country dropdown using Select component */}
        <div className="mb-6">
          <Select
            value={selectedCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              {selectedCountryInfo && (
                <SelectValue placeholder="Select a country">
                  <div className="flex items-center">
                    <img 
                      src={getFlagImageUrl(selectedCountryInfo.code, 32)} 
                      alt={`${selectedCountryInfo.name} flag`} 
                      className="w-8 h-auto mr-3 rounded-sm shadow-sm" 
                    />
                    <span>{selectedCountryInfo.name}</span>
                  </div>
                </SelectValue>
              )}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {countries.map((countryInfo) => (
                <SelectItem key={countryInfo.name} value={countryInfo.name} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img 
                        src={getFlagImageUrl(countryInfo.code, 24)} 
                        alt={`${countryInfo.name} flag`} 
                        className="w-6 h-auto mr-3 rounded-sm shadow-sm" 
                      />
                      <span>{countryInfo.name}</span>
                    </div>
                    <span className="bg-gray-200 dark:bg-gray-900 px-3 py-1 rounded-full text-sm">{countryInfo.count}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Selected country and quantity selection */}
        {selectedCountryInfo && (
          <>
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={selectedCountryInfo.count}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="mt-4">
                <Slider 
                  value={[quantity]}
                  min={1}
                  max={selectedCountryInfo.count}
                  onValueChange={handleSliderChange}
                  className="w-full slider-custom"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                  <span>1</span>
                  <span>{selectedCountryInfo.count}</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Price calculation and buy button */}
        {selectedCountryInfo && (
          <>
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              {/* Promo code input */}
              <div className="mb-4">
                <label htmlFor="promoCode" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    placeholder="Enter promo code"
                    className="flex-grow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-r-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">Promo code applied!</p>
                )}
              </div>

              <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                <span>Price per proxy:</span>
                <span>${pricing?.defaultPrice?.toFixed(2) || "0.00"}</span>
              </div>
              
              {pricing.isDiscountActive && pricing.discountPercent > 0 && (
                <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>-{pricing.discountPercent}%</span>
                </div>
              )}
              
              {promoApplied && promoDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                  <span>Promo discount:</span>
                  <span>-{promoDiscount}%</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 text-gray-800 dark:text-gray-100">
                <span>Total:</span>
                <span>${calculatePrice()?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
            
            <button
              onClick={handleBuy}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Buy Now</span>
            </button>
          </>
        )}
        
        {!selectedCountryInfo && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Select a country to continue
          </div>
        )}
      </div>
    </div>
  )
}

export default Proxies 