import { api } from '../config/api';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    message?: string;
}

// Auth requests
export const authRequests = {
    // Wallet authentication
    getNonce: async (address: string) => {
        return api.post<{ message: string }>('/auth/nonce', { address });
    },

    authenticateWallet: async (address: string, signature: string, message: string) => {
        return api.post<AuthResponse>('/auth/evm', { address, signature, message });
    },

    // Email/Password authentication
    loginWithPassword: async (email: string, password: string) => {
        return api.post<AuthResponse>('/auth/email/login', { email, password });
    },

    // Google authentication
    initiateGoogleAuth: async () => {
        return api.get<{ url: string }>('/auth/google');
    },

    handleGoogleCallback: async (code: string) => {
        return api.get<AuthResponse>(`/auth/google/callback?code=${code}`);
    },

    // Logout
    logout: async () => {
        return api.post('/auth/logout', {});
    }
};

// Proxy requests
export const proxyRequests = {
    getProxies: async () => {
        return api.get('/proxies');
    },

    getProxyById: async (id: string) => {
        return api.get(`/proxies/${id}`);
    },

    createProxy: async (data: any) => {
        return api.post('/proxies', data);
    },

    updateProxy: async (id: string, data: any) => {
        return api.put(`/proxies/${id}`, data);
    },

    deleteProxy: async (id: string) => {
        return api.delete(`/proxies/${id}`);
    }
};

// User requests
export const userRequests = {
    getProfile: async () => {
        return api.get('/user/profile');
    },

    updateProfile: async (data: any) => {
        return api.put('/user/profile', data);
    }
}; 