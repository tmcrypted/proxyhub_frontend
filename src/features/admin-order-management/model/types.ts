export interface Order {
  id: number
  userId: number
  user: {
    id: number
    name?: string
    email?: string
  }
  currency: string
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  type: 'PURCHASE' | 'TRIAL'
  isReservation: boolean
  initialPrice: number
  totalPrice: number
  promoCode?: string
  discount?: number
  paidAt?: string
  createdAt: string
  expiresAt?: string
  payment?: Payment
  orderProxies: OrderProxy[]
}

export interface Payment {
  id: number
  orderId: number
  amount: number
  currency: string
  paymentMethod: 'CRYPTOMUS'
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  createdAt: string
  confirmedAt?: string
  transactionId?: string
  walletAddress?: string
  rawData?: any
}

export interface OrderProxy {
  id: number
  proxyId: number
  orderId: number
  proxy: {
    id: number
    ip: string
    port: string
    login: string
    password: string
    proxyStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
    proxyCountry: {
      id: number
      countryName: string
      countryTicker: string
    }
  }
}

export interface UpdateOrderData {
  status?: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  promoCode?: string
} 