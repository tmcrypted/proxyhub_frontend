import type { Proxy } from '../model/types'

type ProxyStatus = Proxy['proxyStatus']
type ProxyProtocol = Proxy['proxyProtocol']
type ProxyType = Proxy['proxyType']

// Утилиты для работы со статусами
export const getStatusColor = (status: ProxyStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'green'
    case 'INACTIVE':
      return 'yellow'
    case 'EXPIRED':
      return 'gray'
    default:
      return 'gray'
  }
}

export const getStatusLabel = (status: ProxyStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'Active'
    case 'INACTIVE':
      return 'Inactive'
    case 'EXPIRED':
      return 'Expired'
    default:
      return status
  }
}

// Утилиты для работы с протоколами
export const getProtocolColor = (protocol: ProxyProtocol) => {
  switch (protocol) {
    case 'HTTP':
      return 'blue'
    case 'HTTPS':
      return 'green'
    case 'SOCKS4':
      return 'purple'
    case 'SOCKS5':
      return 'indigo'
    default:
      return 'gray'
  }
}

export const getProtocolLabel = (protocol: ProxyProtocol) => {
  return protocol
}

// Утилиты для работы с типами
export const getTypeLabel = (type: ProxyType) => {
  switch (type) {
    case 'RESIDENTIAL':
      return 'Residential'
    case 'DATACENTER':
      return 'Datacenter'
    default:
      return type
  }
}

// Утилиты для форматирования данных
export const formatProxyAddress = (proxy: Proxy) => {
  return `${proxy.ip}:${proxy.port}`
}

export const formatProxyCredentials = (proxy: Proxy) => {
  return `${proxy.login}:${proxy.password}`
}

export const formatExpiryDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString()
}

export const formatCreatedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Утилиты для валидации
export const isValidIP = (ip: string) => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipRegex.test(ip)
}

export const isValidPort = (port: string) => {
  const portNum = parseInt(port)
  return portNum >= 1 && portNum <= 65535
}

export const validateProxyData = (data: Partial<Proxy>) => {
  const errors: string[] = []
  
  if (data.ip && !isValidIP(data.ip)) {
    errors.push('Invalid IP address')
  }
  
  if (data.port && !isValidPort(data.port)) {
    errors.push('Invalid port number (must be 1-65535)')
  }
  
  if (data.login && data.login.length < 1) {
    errors.push('Login is required')
  }
  
  if (data.password && data.password.length < 1) {
    errors.push('Password is required')
  }
  
  return errors
}

// Утилиты для фильтрации
export const filterProxiesByStatus = (proxies: Proxy[], status: ProxyStatus) => {
  return proxies.filter(proxy => proxy.proxyStatus === status)
}

export const filterProxiesByCountry = (proxies: Proxy[], countryId: number) => {
  return proxies.filter(proxy => proxy.countryId === countryId)
}

export const filterProxiesByProtocol = (proxies: Proxy[], protocol: ProxyProtocol) => {
  return proxies.filter(proxy => proxy.proxyProtocol === protocol)
}

export const filterProxiesByType = (proxies: Proxy[], type: ProxyType) => {
  return proxies.filter(proxy => proxy.proxyType === type)
}

// Утилиты для сортировки
export const sortProxiesByDate = (proxies: Proxy[], field: 'createdAt' | 'updatedAt' | 'expiresAt' = 'createdAt') => {
  return [...proxies].sort((a, b) => {
    const dateA = new Date(a[field] || 0).getTime()
    const dateB = new Date(b[field] || 0).getTime()
    return dateB - dateA // По убыванию (новые сначала)
  })
}

export const sortProxiesById = (proxies: Proxy[]) => {
  return [...proxies].sort((a, b) => b.id - a.id)
}

export const sortProxiesByStatus = (proxies: Proxy[]) => {
  const statusOrder = { 'ACTIVE': 0, 'INACTIVE': 1, 'EXPIRED': 2 }
  return [...proxies].sort((a, b) => {
    return statusOrder[a.proxyStatus] - statusOrder[b.proxyStatus]
  })
}

// Утилиты для экспорта
export const exportProxiesToCSV = (proxies: Proxy[]) => {
  const headers = ['ID', 'IP', 'Port', 'Login', 'Password', 'Country', 'Status', 'Protocol', 'Type', 'User', 'Expires']
  const rows = proxies.map(proxy => [
    proxy.id,
    proxy.ip,
    proxy.port,
    proxy.login,
    proxy.password,
    proxy.proxyCountry.countryName,
    proxy.proxyStatus,
    proxy.proxyProtocol,
    proxy.proxyType,
    proxy.user?.name || proxy.user?.email || '-',
    formatExpiryDate(proxy.expiresAt)
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  return csvContent
}

// Утилиты для статистики
export const calculateProxyStats = (proxies: Proxy[]) => {
  const stats = {
    total: proxies.length,
    byStatus: {
      active: 0,
      inactive: 0,
      expired: 0
    },
    byType: {
      residential: 0,
      datacenter: 0
    },
    byProtocol: {
      http: 0,
      https: 0,
      socks4: 0,
      socks5: 0
    },
    assigned: 0,
    unassigned: 0
  }
  
  proxies.forEach(proxy => {
    // По статусу
    stats.byStatus[proxy.proxyStatus.toLowerCase() as keyof typeof stats.byStatus]++
    
    // По типу
    stats.byType[proxy.proxyType.toLowerCase() as keyof typeof stats.byType]++
    
    // По протоколу
    const protocolKey = proxy.proxyProtocol.toLowerCase() as keyof typeof stats.byProtocol
    stats.byProtocol[protocolKey]++
    
    // По назначению
    if (proxy.userId) {
      stats.assigned++
    } else {
      stats.unassigned++
    }
  })
  
  return stats
} 