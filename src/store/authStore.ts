import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    address: string | null
    setAuth: (token: string, address: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            address: null,
            setAuth: (token: string, address: string) =>
                set({ isAuthenticated: true, token, address }),
            logout: () =>
                set({ isAuthenticated: false, token: null, address: null })
        }),
        {
            name: 'auth-storage', // уникальное имя для localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
) 