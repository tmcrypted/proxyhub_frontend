import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import type { Order, UpdateOrderData } from '../model/types'

interface OrderFormProps {
    order: Order
    onSubmit: (data: UpdateOrderData) => Promise<void>
    onCancel: () => void
}

export const OrderForm = ({ order, onSubmit, onCancel }: OrderFormProps) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<UpdateOrderData>({
        status: order.status,
        promoCode: order.promoCode || ''
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

    const handleInputChange = (field: keyof UpdateOrderData, value: any) => {
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
                        Edit Order #{order.id}
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
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleInputChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="promoCode">Promo Code</Label>
                            <Input
                                id="promoCode"
                                type="text"
                                value={formData.promoCode}
                                onChange={(e) => handleInputChange('promoCode', e.target.value)}
                                placeholder="Promo code"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Order Details</Label>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">User:</span> {order.user.name || order.user.email}
                            </div>
                            <div>
                                <span className="font-medium">Type:</span> {order.type}
                            </div>
                            <div>
                                <span className="font-medium">Initial Price:</span> ${order.initialPrice}
                            </div>
                            <div>
                                <span className="font-medium">Total Price:</span> ${order.totalPrice}
                            </div>
                            <div>
                                <span className="font-medium">Proxies:</span> {order.orderProxies.length}
                            </div>
                            <div>
                                <span className="font-medium">Currency:</span> {order.currency}
                            </div>
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
                            {loading ? 'Saving...' : 'Update Order'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
} 