const API_URL = 'http://localhost:3030';

export interface Proxy {
    id: number;
    ip: string;
    port: string;
    login: string;
    password: string;
    userId?: number;
    branchId?: number;
    proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    countryId: number;
    proxyType: 'RESIDENTIAL' | 'DATACENTER';
    proxyFormat: 'USERNAME_PASSWORD' | 'IP_AUTH';
    proxyProtocol: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
    assignedAt?: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    branch?: {
        id: number;
        comment?: string;
    };
    proxyCountry: {
        id: number;
        countryName: string;
        countryTicker: string;
    };
}

export interface CreateProxyDto {
    ip: string;
    port: string;
    login: string;
    password: string;
    branchId?: number;
    userId?: number;
    proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    countryId: number;
    proxyType: 'RESIDENTIAL' | 'DATACENTER';
    proxyFormat: 'USERNAME_PASSWORD' | 'IP_AUTH';
    proxyProtocol: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
    expiryDays?: number;
}

export interface UpdateProxyDto {
    ip?: string;
    port?: string;
    login?: string;
    password?: string;
    branchId?: number;
    userId?: number;
    proxyStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    countryId?: number;
    proxyType?: 'RESIDENTIAL' | 'DATACENTER';
    proxyFormat?: 'USERNAME_PASSWORD' | 'IP_AUTH';
    proxyProtocol?: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
    expiresAt?: string;
}

export interface ProxyCountry {
    id: number;
    countryName: string;
    countryTicker: string;
}

export interface Branch {
    id: number;
    comment?: string;
}

class ProxyService {
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || response.statusText);
        }
        return response.json() as Promise<T>;
    }

    async getProxies(params?: { branchId?: number; userId?: number }): Promise<Proxy[]> {
        const url = new URL(`${API_URL}/proxies`);
        
        // Add query parameters if provided
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, value.toString());
                }
            });
        }
        
        const response = await fetch(url.toString());
        return this.handleResponse<Proxy[]>(response);
    }

    async getProxy(id: number): Promise<Proxy> {
        const response = await fetch(`${API_URL}/proxies/${id}`);
        return this.handleResponse<Proxy>(response);
    }

    async createProxy(proxy: CreateProxyDto): Promise<Proxy> {
        const response = await fetch(`${API_URL}/proxies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proxy)
        });
        return this.handleResponse<Proxy>(response);
    }

    async updateProxy(id: number, proxy: UpdateProxyDto): Promise<Proxy> {
        const response = await fetch(`${API_URL}/proxies/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proxy)
        });
        return this.handleResponse<Proxy>(response);
    }

    async deleteProxy(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/proxies/${id}`, {
            method: 'DELETE'
        });
        await this.handleResponse<void>(response);
    }

    async getAvailableProxiesByCountry(): Promise<Array<{ name: string; code: string; count: number }>> {
        const response = await fetch(`${API_URL}/proxies/available/by-country`);
        return this.handleResponse<Array<{ name: string; code: string; count: number }>>(response);
    }

    // Helper method to get countries from the backend
    async getCountries(): Promise<ProxyCountry[]> {
        const response = await fetch(`${API_URL}/proxy-countries`);
        return this.handleResponse<ProxyCountry[]>(response);
    }

    // Helper method to get branches from the backend
    async getBranches(): Promise<Branch[]> {
        const response = await fetch(`${API_URL}/branches`);
        return this.handleResponse<Branch[]>(response);
    }
}

export default new ProxyService(); 