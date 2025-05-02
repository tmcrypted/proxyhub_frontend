import { create } from 'zustand'

interface Proxy {
    id: string
    type: string
    location: string
    price: number
    speed: number
}

interface ProxyState {
    proxies: Proxy[]
    loading: boolean
    error: string | null
    fetchProxies: () => Promise<void>
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useProxyStore = create<ProxyState>((set) => ({
    proxies: [],
    loading: false,
    error: null,
    fetchProxies: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('YOUR_API_URL/proxies')
            const data = await response.json()
            set({ proxies: data, loading: false })
        } catch (error) {
            set({ error: 'Failed to fetch proxies', loading: false })
        }
    },
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error })
})) 