import { config } from '@/shared/config'
import { useAuthStore } from './authStore'

export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  headers?: Record<string, string>
  _skipAuth?: boolean
  _retryCount?: number
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  headers: Headers
}

export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private authToken: string | null = null
  private refreshPromise: Promise<boolean> | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(config)
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { url, method = 'GET', data, headers = {}, _skipAuth = false, _retryCount = 0 } = config

    // Build request headers
    const requestHeaders = new Headers({
      ...this.defaultHeaders,
      ...headers,
    })

    // Add authorization header if needed
    if (!_skipAuth && this.authToken && this.authToken !== 'cookie-based') {
      requestHeaders.set('Authorization', `Bearer ${this.authToken}`)
    }

    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include cookies for auth
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data)
    }

    // Make the request
    const response = await fetch(`${this.baseURL}${url}`, requestOptions)

    // Handle response
    if (!response.ok) {
      // If we get 401 and have a refresh token, try to refresh
      if (response.status === 401 && !_skipAuth && _retryCount === 0) {
        const refreshed = await this.tryRefreshToken()
        if (refreshed) {
          // Retry the request with new token
          return this.makeRequest<T>({
            ...config,
            _retryCount: _retryCount + 1
          })
        }
      }
      
      const error = await this.createApiError(response)
      throw error
    }

    // Parse response
    let responseData: T
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text() as T
    }

    return {
      data: responseData,
      status: response.status,
      headers: response.headers,
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = useAuthStore.getState().refreshTokens()
    
    try {
      const success = await this.refreshPromise
      if (success) {
        // Update the token in apiClient
        const newToken = useAuthStore.getState().token
        this.setAuthToken(newToken)
      }
      return success
    } finally {
      this.refreshPromise = null
    }
  }

  private async createApiError(response: Response): Promise<Error> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message
      }
    } catch {
      // If not JSON, try to get text
      try {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      } catch {
        // Use default error message
      }
    }

    const error = new Error(errorMessage) as any
    error.status = response.status
    error.response = response
    return error
  }

  // Simplified methods for features - return data directly
  async get<T>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'GET', ...config })
    return response.data
  }

  async post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'POST', data, ...config })
    return response.data
  }

  async put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'PUT', data, ...config })
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'PATCH', data, ...config })
    return response.data
  }

  async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'DELETE', ...config })
    return response.data
  }

  async deleteWithBody<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    const response = await this.request<T>({ url, method: 'DELETE', data, ...config })
    return response.data
  }

  // Full response methods for advanced use cases
  async requestFull<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(config)
  }

  async getFull<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'GET', ...config })
  }

  async postFull<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'POST', data, ...config })
  }

  async putFull<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PUT', data, ...config })
  }

  async patchFull<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PATCH', data, ...config })
  }

  async deleteFull<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'DELETE', ...config })
  }
}

// Singleton instance
export const apiClient = new ApiClient(config.api.baseUrl) 