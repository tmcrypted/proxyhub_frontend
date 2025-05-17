import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    address: string | null
    email: string | null
    role: string | null
    setAuth: (token: string, address?: string, email?: string, role?: string) => void
    logout: () => void
}

// JWT payload interface
interface JwtPayload {
    sub: number
    address?: string
    email?: string
    role: string
    exp: number
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            address: null,
            email: null,
            role: null,
            setAuth: (token: string, address?: string, email?: string, role?: string) => {
                // Debug information
                console.log('Setting auth with token:', token.substring(0, 20) + '...');
                console.log('Provided params:', { address, email, role });
                
                // Try to extract role from JWT token if not provided
                let extractedRole = role
                if (token) {
                    try {
                        const decoded = jwtDecode<JwtPayload>(token)
                        console.log('Decoded JWT token:', decoded);
                        
                        if (!extractedRole && decoded.role) {
                            extractedRole = decoded.role
                            console.log('Extracted role from token:', extractedRole);
                        }
                        
                        // Use email from token if not provided
                        if (!email && decoded.email) {
                            email = decoded.email
                            console.log('Using email from token:', email);
                        }
                        
                        // Use address from token if not provided
                        if (!address && decoded.address) {
                            address = decoded.address
                            console.log('Using address from token:', address);
                        }
                    } catch (error) {
                        console.error('Failed to decode JWT token:', error)
                    }
                }
                
                console.log('Final auth state:', { 
                    isAuthenticated: true, 
                    tokenLength: token.length, 
                    address, 
                    email, 
                    role: extractedRole
                });
                
                set({ 
                    isAuthenticated: true, 
                    token, 
                    address, 
                    email, 
                    role: extractedRole
                })
            },
            logout: () => {
                console.log('Logging out, clearing auth state');
                set({ isAuthenticated: false, token: null, address: null, email: null, role: null })
            }
        }),
        {
            name: 'auth-storage', // уникальное имя для localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
) 