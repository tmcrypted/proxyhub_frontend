// Конфигурация для всех URL и endpoints в приложении
export const config = {
  api: {
    // Основной API URL (используется переменная окружения или fallback)
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3030',
    
    // Альтернативные endpoints
    fallbackUrl: 'http://localhost:3000',
    
    // Timeout для запросов (в миллисекундах)
    timeout: 10000,
  },
  
  external: {
    // API для получения флагов стран
    flagsApi: 'https://flagsapi.com',
    
    // Alchemy API для Ethereum
    alchemyBaseUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    
    // Другие внешние API
    exampleUrl: 'https://example.com',
  },
  
  app: {
    // Базовый URL приложения
    baseUrl: import.meta.env.VITE_APP_URL || 'https://proxyhub.com',
    
    // URL для реферальных ссылок
    referralBaseUrl: import.meta.env.VITE_REFERRAL_URL || 'https://proxyhub.com/ref',
    
    // Название приложения
    name: 'ProxyHub',
  },
  
  features: {
    // Включить/выключить определенные функции
    enableReferrals: true,
    enableCryptoPayments: true,
    enableEmailAuth: true,
  }
} as const

// Типы для конфигурации
export type Config = typeof config

// Хелпер функции для работы с URL
export const urlHelpers = {
  // Получить полный API URL
  getApiUrl: (endpoint: string) => `${config.api.baseUrl}${endpoint}`,
  
  // Получить URL флага страны
  getFlagUrl: (countryCode: string, size: number = 48) => 
    `${config.external.flagsApi}/${countryCode}/flat/${size}.png`,
  
  // Получить реферальную ссылку
  getReferralUrl: (userId: string) => 
    `${config.app.referralBaseUrl}/${userId}`,
  
  // Получить Alchemy URL
  getAlchemyUrl: (apiKey: string) => 
    `${config.external.alchemyBaseUrl}/${apiKey}`,
}

export default config 