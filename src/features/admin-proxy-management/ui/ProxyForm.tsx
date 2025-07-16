import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { X } from 'lucide-react'
import type { Proxy, CreateProxyData, UpdateProxyData } from '../model/types'

interface ProxyFormProps {
    proxy?: Proxy | null
    onSubmit: (data: CreateProxyData | UpdateProxyData) => Promise<void>
    onCancel: () => void
}

export const ProxyForm = ({ proxy, onSubmit, onCancel }: ProxyFormProps) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateProxyData>({
        ip: '',
        port: '',
        login: '',
        password: '',
        proxyStatus: 'ACTIVE',
        countryId: 1, // Default country ID
        proxyType: 'RESIDENTIAL',
        proxyFormat: 'USERNAME_PASSWORD',
        proxyProtocol: 'HTTP'
    })

    useEffect(() => {
        if (proxy) {
            setFormData({
                branchId: proxy.branchId,
                ip: proxy.ip,
                port: proxy.port,
                login: proxy.login,
                password: proxy.password,
                userId: proxy.userId,
                proxyStatus: proxy.proxyStatus,
                countryId: proxy.countryId,
                proxyType: proxy.proxyType,
                proxyFormat: proxy.proxyFormat,
                proxyProtocol: proxy.proxyProtocol,
                assignedAt: proxy.assignedAt,
                expiresAt: proxy.expiresAt
            })
        }
    }, [proxy])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            if (proxy) {
                await (onSubmit as (id: number, data: UpdateProxyData) => Promise<void>)(proxy.id, formData as UpdateProxyData)
            } else {
                await (onSubmit as (data: CreateProxyData) => Promise<void>)(formData as CreateProxyData)
            }
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof CreateProxyData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            {proxy ? 'Edit Proxy' : 'Add New Proxy'}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="ip">IP Address</Label>
                                <Input
                                    id="ip"
                                    type="text"
                                    value={formData.ip}
                                    onChange={(e) => handleInputChange('ip', e.target.value)}
                                    placeholder="192.168.1.1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="port">Port</Label>
                                <Input
                                    id="port"
                                    type="text"
                                    value={formData.port}
                                    onChange={(e) => handleInputChange('port', e.target.value)}
                                    placeholder="8080"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="login">Login</Label>
                                <Input
                                    id="login"
                                    type="text"
                                    value={formData.login}
                                    onChange={(e) => handleInputChange('login', e.target.value)}
                                    placeholder="username"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="countryId">Country</Label>
                                <Select
                                    value={formData.countryId?.toString()}
                                    onValueChange={(value) => handleInputChange('countryId', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">US - United States</SelectItem>
                                        <SelectItem value="2">GB - United Kingdom</SelectItem>
                                        <SelectItem value="3">DE - Germany</SelectItem>
                                        <SelectItem value="4">FR - France</SelectItem>
                                        <SelectItem value="5">NL - Netherlands</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="proxyStatus">Status</Label>
                                <Select
                                    value={formData.proxyStatus}
                                    onValueChange={(value) => handleInputChange('proxyStatus', value)}
                                >
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="proxyType">Type</Label>
                                <Select
                                    value={formData.proxyType}
                                    onValueChange={(value) => handleInputChange('proxyType', value)}
                                >
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
                                <Label htmlFor="proxyFormat">Format</Label>
                                <Select
                                    value={formData.proxyFormat}
                                    onValueChange={(value) => handleInputChange('proxyFormat', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USERNAME_PASSWORD">Username/Password</SelectItem>
                                        <SelectItem value="IP_AUTH">IP Auth</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="proxyProtocol">Protocol</Label>
                                <Select
                                    value={formData.proxyProtocol}
                                    onValueChange={(value) => handleInputChange('proxyProtocol', value)}
                                >
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiresAt">Expires At</Label>
                                <Input
                                    id="expiresAt"
                                    type="datetime-local"
                                    value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => handleInputChange('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="branchId">Branch ID (Optional)</Label>
                                <Input
                                    id="branchId"
                                    type="number"
                                    value={formData.branchId || ''}
                                    onChange={(e) => handleInputChange('branchId', e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="Branch ID"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (proxy ? 'Update Proxy' : 'Create Proxy')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
    )
} 