import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    address: string | null
    email: string | null
    setAuth: (token: string, address?: string, email?: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            address: null,
            email: null,
            setAuth: (token: string, address?: string, email?: string) =>
                set({ isAuthenticated: true, token, address, email }),
            logout: () =>
                set({ isAuthenticated: false, token: null, address: null, email: null })
        }),
        {
            name: 'auth-storage', // уникальное имя для localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
) 