# Конфигурация Frontend

Все переменные ссылки и API endpoints вынесены в централизованный конфигурационный файл `src/config/index.ts`.

## Переменные окружения

Создайте файл `.env` в корне проекта frontend со следующими переменными:

```env
# API Configuration
VITE_API_URL=http://localhost:3030

# App Configuration  
VITE_APP_URL=https://proxyhub.com
VITE_REFERRAL_URL=https://proxyhub.com/ref

# Wallet Configuration
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
```

## Структура конфигурации

### API настройки
- `config.api.baseUrl` - основной URL API (по умолчанию: `http://localhost:3030`)
- `config.api.fallbackUrl` - резервный URL API (`http://localhost:3000`)
- `config.api.timeout` - таймаут запросов в миллисекундах

### Внешние сервисы
- `config.external.flagsApi` - API для получения флагов стран (`https://flagsapi.com`)
- `config.external.alchemyBaseUrl` - Base URL для Alchemy API
- `config.external.exampleUrl` - URL для примеров/социальных ссылок

### Настройки приложения
- `config.app.baseUrl` - базовый URL приложения
- `config.app.referralBaseUrl` - URL для реферальных ссылок
- `config.app.name` - название приложения

### Функции
- `config.features.enableReferrals` - включить реферальную систему
- `config.features.enableCryptoPayments` - включить криптоплатежи
- `config.features.enableEmailAuth` - включить авторизацию по email

## Хелпер функции

### `urlHelpers.getApiUrl(endpoint)`
Возвращает полный URL для API endpoint:
```typescript
const url = urlHelpers.getApiUrl('/users/profile')
// Результат: 'http://localhost:3030/users/profile'
```

### `urlHelpers.getFlagUrl(countryCode, size)`
Возвращает URL для флага страны:
```typescript
const flagUrl = urlHelpers.getFlagUrl('US', 32)
// Результат: 'https://flagsapi.com/US/flat/32.png'
```

### `urlHelpers.getReferralUrl(userId)`
Возвращает реферальную ссылку:
```typescript
const referralUrl = urlHelpers.getReferralUrl('user123')
// Результат: 'https://proxyhub.com/ref/user123'
```

### `urlHelpers.getAlchemyUrl(apiKey)`
Возвращает URL для Alchemy API:
```typescript
const alchemyUrl = urlHelpers.getAlchemyUrl('your-api-key')
// Результат: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key'
```

## Использование в коде

```typescript
import { config, urlHelpers } from '../config'

// Прямое использование конфига
const apiUrl = config.api.baseUrl

// Использование хелперов
const endpoint = urlHelpers.getApiUrl('/auth/login')
const flagUrl = urlHelpers.getFlagUrl('RU', 24)
```

## Fallback значения

Если переменные окружения не установлены, используются следующие значения по умолчанию:
- API URL: `http://localhost:3030`
- App URL: `https://proxyhub.com` 
- Referral URL: `https://proxyhub.com/ref`

## Обновленные файлы

Следующие файлы были обновлены для использования конфига:
- `src/lib/api.ts`
- `src/services/api/requests.ts`
- `src/pages/buy.tsx`
- `src/pages/auth.tsx`
- `src/pages/register.tsx`
- `src/pages/email-verification.tsx`
- `src/pages/profile/ProfileReferrals.tsx`
- `src/lib/wagmi.ts`
- `src/main.tsx` 