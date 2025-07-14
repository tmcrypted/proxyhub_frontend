import { useAuthStore } from '../stores/authStore'

export default function useIsAdmin() {
    const { user } = useAuthStore()
    return user?.role === 'ADMIN'
} 