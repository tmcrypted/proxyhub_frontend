import { createContext, useContext, ReactNode } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useAuthStore } from '../stores/authStore'

interface AuthContextType {
    isAuthenticated: boolean;
    address: string | undefined;
    email: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { isAuthenticated, email, logout: storeLogout } = useAuthStore()

    const logout = () => {
        disconnect()
        storeLogout()
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            address,
            email,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 