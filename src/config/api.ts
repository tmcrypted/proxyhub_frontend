const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthToken = () => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        const { state } = JSON.parse(authStorage);
        return state.token;
    }
    return null;
};

const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        
        // // Если это редирект, просто возвращаем response
        // if (response.redirected) {
        //     window.location.href = response.url;
        //     return;
        // }
        
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
            credentials: 'include',
        });
        return response.json();
    },
};

export default api; 