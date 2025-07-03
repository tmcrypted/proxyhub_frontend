import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'
import { http } from 'wagmi'
import { urlHelpers } from '../config'

if (!import.meta.env.VITE_PROJECT_ID) {
    throw new Error('Missing VITE_PROJECT_ID environment variable')
}

export const config = getDefaultConfig({
    appName: 'ProxyHub',
    projectId: import.meta.env.VITE_PROJECT_ID,
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(urlHelpers.getAlchemyUrl(import.meta.env.VITE_ALCHEMY_API_KEY || ''))
    },
}) 