import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'
import { http } from 'wagmi'

if (!import.meta.env.VITE_PROJECT_ID) {
    throw new Error('Missing VITE_PROJECT_ID environment variable')
}

export const config = getDefaultConfig({
    appName: 'ProxyHub',
    projectId: import.meta.env.VITE_PROJECT_ID,
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`)
    },
}) 