import { config } from '../config'

const API_URL = config.api.baseUrl

const getAuthToken = () => {
  // First try to get token from auth store
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage)
      return state.token
    } catch (error) {
      console.error('Failed to parse auth storage:', error)
    }
  }
  return null
}

export const api = {
  async request(url: string, options: RequestInit = {}) {
    const token = getAuthToken()
    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', 'application/json')
    
    if (token && token !== 'cookie-based') {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for cookie-based auth
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message
        }
      } catch {
        // If not JSON, use the raw text
        if (errorText) {
          errorMessage = errorText
        }
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  },

  get(url: string) {
    return this.request(url, { method: 'GET' })
  },

  post(url: string, data: any) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Orders API
  orders: {
    create: (data: { countryId: number; proxyCount: number; promoCode?: string }) => {
      return api.post('/orders', data)
    },
    
    getMyOrders: () => {
      return api.get('/orders/my')
    }
  },

  // Proxies API
  proxies: {
    getMyProxies: (orderId?: number) => {
      const url = orderId ? `/proxies/my?orderId=${orderId}` : '/proxies/my'
      return api.get(url)
    }
  }
}