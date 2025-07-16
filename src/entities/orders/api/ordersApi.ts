import { apiClient } from '@/shared/api/apiClient';

export interface CreateOrderRequest {
  countryId: number;
  proxyCount: number;
  promoCode?: string;
}

export interface Order {
  id: number;
  userId: number;
  currency: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  type: 'PURCHASE' | 'TRIAL';
  isReservation: boolean;
  initialPrice: number;
  totalPrice: number;
  promoCode?: string;
  discount?: number;
  paidAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export const ordersApi = {
  // Получить заказы пользователя
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/my');
    return response as Order[];
  },

  // Получить конкретный заказ
  getOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response as Order;
  },

  // Создать новый заказ
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    console.log('Creating order with data:', orderData);
    try {
      const response = await apiClient.post('/orders', orderData);
      console.log('API response:', response);
      console.log('API response type:', typeof response);
      console.log('API response keys:', Object.keys(response || {}));
      
      if (!response) {
        throw new Error('API returned null or undefined response');
      }
      
      return response as Order;
    } catch (error) {
      console.error('Error in createOrder API call:', error);
      throw error;
    }
  },

  // Обновить заказ
  updateOrder: async (id: number, updateData: Partial<Order>): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}`, updateData);
    return response as Order;
  },

  // Удалить заказ
  deleteOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response as Order;
  },

  // Отметить заказ как оплаченный
  markAsPaid: async (id: number): Promise<Order> => {
    const response = await apiClient.patch(`/orders/${id}/mark-paid`);
    return response as Order;
  },
}; 