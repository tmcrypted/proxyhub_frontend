import { useEffect } from 'react';
import { useOrders, useOrdersLoading, useOrdersError, useOrdersActions } from '../model';

export const useOrders = () => {
  const orders = useOrders();
  const isLoading = useOrdersLoading();
  const error = useOrdersError();
  const actions = useOrdersActions();

  // Автоматически загружаем заказы при монтировании компонента
  useEffect(() => {
    actions.fetchMyOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    ...actions,
  };
}; 