import { useOrderStore } from './store'

export const useOrders = () => useOrderStore((state) => state.orders)
export const useLoading = () => useOrderStore((state) => state.loading)
export const useError = () => useOrderStore((state) => state.error) 