import { useEffect } from 'react';
import { useCurrentOrder, useOrdersLoading, useOrdersError, useOrdersActions } from '../model';

export const useOrder = (orderId?: number) => {
  const order = useCurrentOrder();
  const isLoading = useOrdersLoading();
  const error = useOrdersError();
  const { fetchOrder, clearCurrentOrder } = useOrdersActions();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }

    return () => {
      clearCurrentOrder();
    };
  }, [orderId]);

  return {
    order,
    isLoading,
    error,
  };
}; 