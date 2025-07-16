export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3030',
    fallbackUrl: 'http://localhost:3000',
    
    timeout: 10000,
  },
  
  external: {
    flagsApi: 'https://flagsapi.com',
    alchemyBaseUrl: 'https://eth-mainnet.g.alchemy.com/v2',
  },

  features: {
    // Включить/выключить определенные функции
    enableReferrals: true,
    enableCryptoPayments: true,
    enableEmailAuth: true,
  }
} as const


export type Config = typeof config

export const urlHelpers = {
  getApiUrl: (endpoint: string) => `${config.api.baseUrl}${endpoint}`,
  
  getFlagUrl: (countryCode: string, size: number = 48) => 
    `${config.external.flagsApi}/${countryCode}/flat/${size}.png`,
  
  
  getReferralUrl: (userId: string) => 
    `${config.api.baseUrl}/${userId}`,
  
  getAlchemyUrl: (apiKey: string) => 
    `${config.external.alchemyBaseUrl}/${apiKey}`,
}

export default config 