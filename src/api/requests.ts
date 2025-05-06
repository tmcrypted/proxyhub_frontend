import { api } from '../config/api';

// Auth requests
export const authRequests = {
    // Wallet authentication
    getNonce: async (address: string) => {
        return api.post('/auth/nonce', { address });
    },

    authenticateWallet: async (address: string, signature: string, message: string) => {
        return api.post('/auth/evm', { address, signature, message });
    },

    // Google authentication
    initiateGoogleAuth: async () => {
        return api.get('/auth/google');
    },

    handleGoogleCallback: async (code: string) => {
        return api.get(`/auth/google/callback?code=${code}`);
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