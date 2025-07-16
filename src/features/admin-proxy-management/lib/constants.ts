// Константы для статусов прокси
export const PROXY_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED'
} as const

// Константы для протоколов
export const PROXY_PROTOCOLS = {
  HTTP: 'HTTP',
  HTTPS: 'HTTPS',
  SOCKS4: 'SOCKS4',
  SOCKS5: 'SOCKS5'
} as const

// Константы для типов прокси
export const PROXY_TYPES = {
  RESIDENTIAL: 'RESIDENTIAL',
  DATACENTER: 'DATACENTER'
} as const

// Константы для форматов прокси
export const PROXY_FORMATS = {
  USERNAME_PASSWORD: 'USERNAME_PASSWORD',
  IP_AUTH: 'IP_AUTH'
} as const

// Константы для стран (хардкод для демо)
export const COUNTRIES = [
  { id: 1, name: 'United States', code: 'US', ticker: 'US' },
  { id: 2, name: 'United Kingdom', code: 'GB', ticker: 'GB' },
  { id: 3, name: 'Germany', code: 'DE', ticker: 'DE' },
  { id: 4, name: 'France', code: 'FR', ticker: 'FR' },
  { id: 5, name: 'Netherlands', code: 'NL', ticker: 'NL' },
  { id: 6, name: 'Canada', code: 'CA', ticker: 'CA' },
  { id: 7, name: 'Australia', code: 'AU', ticker: 'AU' },
  { id: 8, name: 'Japan', code: 'JP', ticker: 'JP' },
  { id: 9, name: 'Singapore', code: 'SG', ticker: 'SG' },
  { id: 10, name: 'Brazil', code: 'BR', ticker: 'BR' }
] as const

// Константы для UI
export const TABLE_PAGE_SIZES = [10, 25, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 25

// Константы для валидации
export const VALIDATION_RULES = {
  IP_REGEX: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  PORT_MIN: 1,
  PORT_MAX: 65535,
  LOGIN_MIN_LENGTH: 1,
  PASSWORD_MIN_LENGTH: 1
} as const

// Константы для сортировки
export const SORT_OPTIONS = {
  ID_ASC: 'id_asc',
  ID_DESC: 'id_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  UPDATED_ASC: 'updated_asc',
  UPDATED_DESC: 'updated_desc',
  EXPIRES_ASC: 'expires_asc',
  EXPIRES_DESC: 'expires_desc',
  STATUS_ASC: 'status_asc',
  STATUS_DESC: 'status_desc'
} as const

// Константы для фильтров
export const FILTER_KEYS = {
  BRANCH_ID: 'branchId',
  USER_ID: 'userId',
  COUNTRY_ID: 'countryId',
  STATUS: 'proxyStatus',
  TYPE: 'proxyType',
  PROTOCOL: 'proxyProtocol'
} as const

// Константы для экспорта
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  EXCEL: 'xlsx'
} as const

// Константы для уведомлений
export const NOTIFICATION_MESSAGES = {
  PROXY_CREATED: 'Proxy created successfully',
  PROXY_UPDATED: 'Proxy updated successfully',
  PROXY_DELETED: 'Proxy deleted successfully',
  PROXY_FETCH_ERROR: 'Failed to fetch proxies',
  PROXY_CREATE_ERROR: 'Failed to create proxy',
  PROXY_UPDATE_ERROR: 'Failed to update proxy',
  PROXY_DELETE_ERROR: 'Failed to delete proxy',
  VALIDATION_ERROR: 'Please check the form data'
} as const

// Константы для модальных окон
export const MODAL_NAMES = {
  CREATE_PROXY: 'create_proxy',
  EDIT_PROXY: 'edit_proxy',
  DELETE_CONFIRM: 'delete_confirm',
  PROXY_DETAILS: 'proxy_details'
} as const 