const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Helper function to handle API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token')
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
        return apiRequest('/user/profile')
    },
    updateProfile: async (data: Record<string, unknown>) => {
        return apiRequest('/user/profile', {
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