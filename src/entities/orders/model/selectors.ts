import { useOrdersStore } from './store';

// Селекторы для получения данных из store
export const useOrders = () => useOrdersStore(state => state.orders);
export const useCurrentOrder = () => useOrdersStore(state => state.currentOrder);
export const useOrdersLoading = () => useOrdersStore(state => state.isLoading);
export const useOrdersError = () => useOrdersStore(state => state.error);

// Селекторы для получения действий
export const useOrdersActions = () => useOrdersStore(state => ({
  fetchMyOrders: state.fetchMyOrders,
  fetchOrder: state.fetchOrder,
  createOrder: state.createOrder,
  updateOrder: state.updateOrder,
  deleteOrder: state.deleteOrder,
  markAsPaid: state.markAsPaid,
  clearError: state.clearError,
  clearCurrentOrder: state.clearCurrentOrder,
}));

// Селекторы для фильтрации заказов
export const useOrdersByStatus = (status: string) => 
  useOrdersStore(state => state.orders.filter(order => order.status === status));

export const usePendingOrders = () => useOrdersByStatus('PENDING');
export const useActiveOrders = () => useOrdersByStatus('ACTIVE');
export const useCancelledOrders = () => useOrdersByStatus('CANCELLED');
export const useExpiredOrders = () => useOrdersByStatus('EXPIRED');

// Селектор для получения общего количества заказов
export const useOrdersCount = () => useOrdersStore(state => state.orders.length);

// Селектор для получения общей суммы заказов
export const useTotalOrdersValue = () => 
  useOrdersStore(state => 
    state.orders.reduce((total, order) => total + order.totalPrice, 0)
  ); 