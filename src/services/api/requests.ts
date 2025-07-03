import { config } from '../../config'

const API_URL = config.api.baseUrl

// Получение токена из auth-storage
function getToken(): string | null {
    try {
        const authStorage = localStorage.getItem('auth-storage')
        if (!authStorage) return null
        const parsed = JSON.parse(authStorage)
        return parsed?.state?.token || null
    } catch {
        return null
    }
}

// Helper function to handle API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken()
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
}

// Auth requests
export const authRequests = {
    login: async (data: { email: string; password: string }) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },
    logout: async () => {
        return apiRequest('/auth/logout', {
            method: 'POST',
        })
    }
}

// User requests
export const userRequests = {
    getProfile: async () => {
        return apiRequest('/users/profile')
    },
    updateProfile: async (data: Record<string, unknown>) => {
        return apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }
}

// Order requests
export const orderRequests = {
    getOrders: async () => {
        return apiRequest('/orders')
    },
    createOrder: async (data: Record<string, unknown>) => {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },
    renewOrder: async (orderId: string) => {
        return apiRequest(`/orders/${orderId}/renew`, {
            method: 'POST',
        })
    }
}

// Transaction requests
export const transactionRequests = {
    getTransactions: async () => {
        return apiRequest('/transactions')
    },
    createTransaction: async (data: Record<string, unknown>) => {
        return apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
}

// Referral requests
export const referralRequests = {
    getReferrals: async () => {
        return apiRequest('/referrals')
    },
    getReferralStats: async () => {
        return apiRequest('/referrals/stats')
    }
} 