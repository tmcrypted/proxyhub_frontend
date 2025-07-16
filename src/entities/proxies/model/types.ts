// Типы для прокси
export interface Proxy {
  id: number
  ip: string
  port: string
  login: string
  password: string
  proxyStatus: ProxyStatus
  proxyType: ProxyType
  proxyFormat: ProxyFormat
  proxyProtocol: ProxyProtocol
  countryId: number
  userId?: number
  branchId?: number
  assignedAt?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  proxyCountry?: ProxyCountry
  user?: User
  branch?: Branch
  orderProxies?: OrderProxy[]
}

export interface ProxyCountry {
  id: number
  countryName: string
  countryTicker: string
}

export interface User {
  id: number
  email: string
  role: string
}

export interface Branch {
  id: number
  name: string
}

export interface OrderProxy {
  id: number
  orderId: number
  proxyId: number
  order?: Order
}

export interface Order {
  id: number
  status: OrderStatus
  type: string
  totalPrice: number
  currency: string
  createdAt: Date
  expiresAt?: Date
  paidAt?: Date
}

// Enum типы
export enum ProxyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

export enum ProxyType {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  SOCKS4 = 'SOCKS4',
  SOCKS5 = 'SOCKS5'
}

export enum ProxyFormat {
  IP_PORT = 'IP_PORT',
  IP_PORT_LOGIN_PASSWORD = 'IP_PORT_LOGIN_PASSWORD'
}

export enum ProxyProtocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  SOCKS4 = 'SOCKS4',
  SOCKS5 = 'SOCKS5'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

// Типы для доступных прокси по странам
export interface AvailableProxyByCountry {
  id: number
  name: string
  code: string
  count: number
}

// Типы для ценообразования
export interface Pricing {
  id: number
  defaultPrice: number
  discountPercent: number
  isDiscountActive: boolean
  discountStartDate?: Date
  discountEndDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Типы для запросов
export interface GetUserProxiesParams {
  orderId?: number
}

export interface GetProxiesParams {
  branchId?: number
  userId?: number
}

// Типы для создания прокси
export interface CreateProxyData {
  branchId?: number
  ip: string
  port: string
  login: string
  password: string
  userId?: number
  proxyStatus: ProxyStatus
  countryId: number
  proxyType: ProxyType
  proxyFormat: ProxyFormat
  proxyProtocol: ProxyProtocol
  assignedAt?: Date
  expiresAt?: Date
}

export interface UpdateProxyData {
  branchId?: number
  ip?: string
  port?: string
  login?: string
  password?: string
  userId?: number
  proxyStatus?: ProxyStatus
  countryId?: number
  proxyType?: ProxyType
  proxyFormat?: ProxyFormat
  proxyProtocol?: ProxyProtocol
  assignedAt?: Date
  expiresAt?: Date
} 