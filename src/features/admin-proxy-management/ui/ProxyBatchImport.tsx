import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react'
import { useProxyStore } from '../model/store'
import type { Proxy } from '../model/types'
import { COUNTRIES } from '../lib/constants'
import { apiClient } from '@/shared/api/apiClient'

type ProxyStatus = Proxy['proxyStatus']
type ProxyType = Proxy['proxyType']
type ProxyFormat = Proxy['proxyFormat']
type ProxyProtocol = Proxy['proxyProtocol']

interface ProxyBatchImportProps {
  onClose: () => void
}

interface ParsedProxy {
  ip: string
  port: string
  login: string
  password: string
}

export const ProxyBatchImport = ({ onClose }: ProxyBatchImportProps) => {
  const [importText, setImportText] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [parsedProxies, setParsedProxies] = useState<ParsedProxy[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ created: number; errors: string[] } | null>(null)
  const [branches, setBranches] = useState<{ id: number; comment?: string }[]>([])

  // Общие настройки для всех прокси
  const [commonSettings, setCommonSettings] = useState({
    proxyStatus: 'ACTIVE' as ProxyStatus,
    countryId: 1, // По умолчанию
    proxyType: 'RESIDENTIAL' as ProxyType,
    proxyFormat: 'USERNAME_PASSWORD' as ProxyFormat,
    proxyProtocol: 'HTTP' as ProxyProtocol,
  })

  useEffect(() => {
    // Получить список веток
    apiClient.get<Array<{ id: number; name: string }>>('/branches').then((response) => {
      setBranches(response.data)
    })
  }, [])

  const { createBatchProxies } = useProxyStore()

  const parseProxyText = (text: string): ParsedProxy[] => {
    const lines = text.trim().split('\n').filter(line => line.trim())
    const proxies: ParsedProxy[] = []
    const errors: string[] = []

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // Поддерживаемые форматы:
      // 1. ip:port:login:password
      // 2. ip:port login:password
      // 3. ip:port@login:password
      
      let parts: string[] = []
      
      if (trimmedLine.includes('@')) {
        // Формат ip:port@login:password
        const [addressPart, credentialsPart] = trimmedLine.split('@')
        if (addressPart && credentialsPart) {
          const [ip, port] = addressPart.split(':')
          const [login, password] = credentialsPart.split(':')
          parts = [ip, port, login, password]
        }
      } else if (trimmedLine.includes(' ')) {
        // Формат ip:port login:password
        const [addressPart, credentialsPart] = trimmedLine.split(' ')
        if (addressPart && credentialsPart) {
          const [ip, port] = addressPart.split(':')
          const [login, password] = credentialsPart.split(':')
          parts = [ip, port, login, password]
        }
      } else {
        // Формат ip:port:login:password
        parts = trimmedLine.split(':')
      }

      if (parts.length !== 4) {
        errors.push(`Строка ${index + 1}: Неверный формат. Ожидается: ip:port:login:password`)
        return
      }

      const [ip, port, login, password] = parts

      // Валидация IP
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      if (!ipRegex.test(ip)) {
        errors.push(`Строка ${index + 1}: Неверный IP адрес "${ip}"`)
        return
      }

      // Валидация порта
      const portNum = parseInt(port)
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        errors.push(`Строка ${index + 1}: Неверный порт "${port}"`)
        return
      }

      if (!login.trim()) {
        errors.push(`Строка ${index + 1}: Пустой логин`)
        return
      }

      if (!password.trim()) {
        errors.push(`Строка ${index + 1}: Пустой пароль`)
        return
      }

      proxies.push({ ip, port, login, password })
    })

    setErrors(errors)
    return proxies
  }

  const handleTextChange = (text: string) => {
    setImportText(text)
    const parsed = parseProxyText(text)
    setParsedProxies(parsed)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setImportText(text)
      const parsed = parseProxyText(text)
      setParsedProxies(parsed)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (parsedProxies.length === 0) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const result = await createBatchProxies({
        ...commonSettings,
        proxies: parsedProxies
      })
      setImportResult(result)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Ошибка импорта'])
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    if (importResult && importResult.created > 0) {
      onClose()
    } else {
      setImportText('')
      setImportFile(null)
      setParsedProxies([])
      setErrors([])
      setImportResult(null)
    }
  }

  const loadExample = () => {
    const exampleText = `192.168.1.1:8080:user1:pass1
192.168.1.2:8080:user2:pass2
192.168.1.3:8080:user3:pass3
10.0.0.1:3128:proxy_user:proxy_pass
10.0.0.2:3128:test_user:test_pass`
    setImportText(exampleText)
    const parsed = parseProxyText(exampleText)
    setParsedProxies(parsed)
  }

  const generateBatchProxies = (count: number) => {
    const proxies: string[] = []
    for (let i = 1; i <= count; i++) {
      const ip = `192.168.${Math.floor(i / 255) + 1}.${(i % 255) + 1}`
      const port = '8080'
      const login = `user${i}`
      const password = `pass${i}`
      proxies.push(`${ip}:${port}:${login}:${password}`)
    }
    const batchText = proxies.join('\n')
    setImportText(batchText)
    const parsed = parseProxyText(batchText)
    setParsedProxies(parsed)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Batch Import Proxies
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Батч генерация */}
        <div className="space-y-2">
          <Label>Quick Batch Generation</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateBatchProxies(10)}
            >
              Generate 10
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateBatchProxies(50)}
            >
              Generate 50
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateBatchProxies(100)}
            >
              Generate 100
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateBatchProxies(500)}
            >
              Generate 500
            </Button>
          </div>
        </div>

        {/* Общие настройки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="proxyStatus">Status</Label>
            <Select value={commonSettings.proxyStatus} onValueChange={(value: ProxyStatus) => setCommonSettings(prev => ({ ...prev, proxyStatus: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="countryId">Country</Label>
            <Select
              value={commonSettings.countryId.toString()}
              onValueChange={v => setCommonSettings(prev => ({ ...prev, countryId: Number(v) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.code} - {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="branchId">Branch</Label>
            <Select
              value={commonSettings.branchId !== undefined ? commonSettings.branchId.toString() : 'none'}
              onValueChange={v => setCommonSettings(prev => ({ ...prev, branchId: v === 'none' ? undefined : Number(v) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No branch</SelectItem>
                {branches.map(b => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.id}{b.comment ? ` — ${b.comment}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="proxyType">Type</Label>
            <Select value={commonSettings.proxyType} onValueChange={(value: ProxyType) => setCommonSettings(prev => ({ ...prev, proxyType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                <SelectItem value="DATACENTER">Datacenter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="proxyProtocol">Protocol</Label>
            <Select value={commonSettings.proxyProtocol} onValueChange={(value: ProxyProtocol) => setCommonSettings(prev => ({ ...prev, proxyProtocol: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="HTTPS">HTTPS</SelectItem>
                <SelectItem value="SOCKS4">SOCKS4</SelectItem>
                <SelectItem value="SOCKS5">SOCKS5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Импорт */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="importFile">Upload File</Label>
            <Input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="importText">Or paste text</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadExample}
                className="text-xs"
              >
                Load Example
              </Button>
            </div>
            <Textarea
              placeholder="ip:port:login:password&#10;192.168.1.1:8080:user1:pass1&#10;192.168.1.2:8080:user2:pass2"
              value={importText}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={10}
              className="mt-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Статистика */}
        {parsedProxies.length > 0 && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Найдено {parsedProxies.length} прокси для импорта
            </AlertDescription>
          </Alert>
        )}

        {/* Ошибки валидации */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm">{error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Результат импорта */}
        {importResult && (
          <Alert variant={importResult.created > 0 ? "default" : "destructive"}>
            {importResult.created > 0 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <div>Импортировано: {importResult.created} прокси</div>
                {importResult.errors.length > 0 && (
                  <div>
                    <div className="font-medium">Ошибки:</div>
                    <div className="space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm">{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            {importResult && importResult.created > 0 ? 'Close' : 'Cancel'}
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedProxies.length === 0 || isImporting}
            className="min-w-[100px]"
          >
            {isImporting ? 'Importing...' : `Import ${parsedProxies.length}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 