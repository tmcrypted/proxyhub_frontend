const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030'

const getAuthToken = () => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    const { state } = JSON.parse(authStorage)
    return state.token
  }
  return null
}

export const api = {
  async request(url: string, options: RequestInit = {}) {
    const token = getAuthToken()
    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', 'application/json')
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
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
  }
}