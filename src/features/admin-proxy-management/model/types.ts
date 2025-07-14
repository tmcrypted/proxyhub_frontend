export interface ProxyCountry {
  id: number;
  countryName: string;
  countryTicker: string;
}

export interface Branch {
  id: number;
  comment?: string;
  createdAt: string;
}

export interface User {
  id: number;
  name?: string;
  email?: string;
  role: 'USER' | 'ADMIN';
}

export interface Proxy {
  id: number;
  branchId?: number;
  branch?: Branch;
  ip: string;
  port: string;
  login: string;
  password: string;
  userId?: number;
  user?: User;
  proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  countryId: number;
  proxyCountry: ProxyCountry;
  proxyType: 'RESIDENTIAL' | 'DATACENTER';
  proxyFormat: 'USERNAME_PASSWORD' | 'IP_AUTH';
  proxyProtocol: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
  assignedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProxyData {
  branchId?: number;
  ip: string;
  port: string;
  login: string;
  password: string;
  userId?: number;
  proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  countryId: number;
  proxyType: 'RESIDENTIAL' | 'DATACENTER';
  proxyFormat: 'USERNAME_PASSWORD' | 'IP_AUTH';
  proxyProtocol: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
  assignedAt?: string;
  expiresAt?: string;
}

export interface UpdateProxyData {
  branchId?: number;
  ip?: string;
  port?: string;
  login?: string;
  password?: string;
  userId?: number;
  proxyStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  countryId?: number;
  proxyType?: 'RESIDENTIAL' | 'DATACENTER';
  proxyFormat?: 'USERNAME_PASSWORD' | 'IP_AUTH';
  proxyProtocol?: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
  assignedAt?: string;
  expiresAt?: string;
}

export interface ProxyFilters {
  branchId?: number;
  userId?: number;
  countryId?: number;
  proxyStatus?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  proxyType?: 'RESIDENTIAL' | 'DATACENTER';
  proxyProtocol?: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
}

export interface BatchProxyItem {
  ip: string;
  port: string;
  login: string;
  password: string;
}

export interface BatchCreateProxyData {
  branchId?: number;
  userId?: number;
  proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  countryId: number;
  proxyType: 'RESIDENTIAL' | 'DATACENTER';
  proxyFormat: 'USERNAME_PASSWORD' | 'IP_AUTH';
  proxyProtocol: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
  assignedAt?: string;
  expiresAt?: string;
  proxies: BatchProxyItem[];
} 