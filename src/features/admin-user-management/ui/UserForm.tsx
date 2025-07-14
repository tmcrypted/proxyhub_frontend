import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { X } from 'lucide-react'
import type { User, UpdateUserData } from '../model/types'

interface UserFormProps {
    user: User
    onSubmit: (data: UpdateUserData) => Promise<void>
    onCancel: () => void
}

export const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<UpdateUserData>({
        role: user.role,
        name: user.name || '',
        email: user.email || '',
        evmAddress: user.evmAddress || '',
        authProvider: user.authProvider,
        isHaveNowpaymentsAccount: user.isHaveNowpaymentsAccount,
        isVerified: user.isVerified
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof UpdateUserData, value: any) => {
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
                        Edit User #{user.id}
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
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="User name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="evmAddress">EVM Address</Label>
                            <Input
                                id="evmAddress"
                                type="text"
                                value={formData.evmAddress}
                                onChange={(e) => handleInputChange('evmAddress', e.target.value)}
                                placeholder="0x..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => handleInputChange('role', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="authProvider">Auth Provider</Label>
                            <Select
                                value={formData.authProvider}
                                onValueChange={(value) => handleInputChange('authProvider', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMAIL">Email</SelectItem>
                                    <SelectItem value="GOOGLE">Google</SelectItem>
                                    <SelectItem value="WALLET">Wallet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isVerified">Verified</Label>
                            <Switch
                                id="isVerified"
                                checked={formData.isVerified}
                                onCheckedChange={(checked) => handleInputChange('isVerified', checked)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isHaveNowpaymentsAccount">Has NowPayments Account</Label>
                            <Switch
                                id="isHaveNowpaymentsAccount"
                                checked={formData.isHaveNowpaymentsAccount}
                                onCheckedChange={(checked) => handleInputChange('isHaveNowpaymentsAccount', checked)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
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
                            {loading ? 'Saving...' : 'Update User'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
} 