import { useUserStore } from './store'

export const useUsers = () => useUserStore((state) => state.users)
export const useLoading = () => useUserStore((state) => state.loading)
export const useError = () => useUserStore((state) => state.error) 