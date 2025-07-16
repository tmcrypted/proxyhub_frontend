import { create } from 'zustand';
import { Order, CreateOrderRequest, ordersApi } from '../api';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

interface OrdersActions {
  // Получить заказы пользователя
  fetchMyOrders: () => Promise<void>;
  
  // Получить конкретный заказ
  fetchOrder: (id: number) => Promise<void>;
  
  // Создать новый заказ
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  
  // Обновить заказ
  updateOrder: (id: number, updateData: Partial<Order>) => Promise<void>;
  
  // Удалить заказ
  deleteOrder: (id: number) => Promise<void>;
  
  // Отметить заказ как оплаченный
  markAsPaid: (id: number) => Promise<void>;
  
  // Очистить ошибку
  clearError: () => void;
  
  // Очистить текущий заказ
  clearCurrentOrder: () => void;
}

type OrdersStore = OrdersState & OrdersActions;

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersApi.getMyOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders', 
        isLoading: false 
      });
    }
  },

  fetchOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.getOrder(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch order', 
        isLoading: false 
      });
    }
  },

  createOrder: async (orderData: CreateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await ordersApi.createOrder(orderData);
      set(state => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isLoading: false
      }));
      return newOrder;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create order', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateOrder: async (id: number, updateData: Partial<Order>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersApi.updateOrder(id, updateData);
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update order', 
        isLoading: false 
      });
    }
  },

  deleteOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.deleteOrder(id);
      set(state => ({
        orders: state.orders.filter(order => order.id !== id),
        currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete order', 
        isLoading: false 
      });
    }
  },

  markAsPaid: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersApi.markAsPaid(id);
      set(state => ({
        orders: state.orders.map(order => 
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark order as paid', 
        isLoading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
})); 