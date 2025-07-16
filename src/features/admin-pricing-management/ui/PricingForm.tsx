import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { X } from 'lucide-react'
import type { Pricing, UpdatePricingData } from '../model/types'

interface PricingFormProps {
    pricing: Pricing
    onSubmit: (data: UpdatePricingData) => Promise<void>
    onCancel: () => void
}

export const PricingForm = ({ pricing, onSubmit, onCancel }: PricingFormProps) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<UpdatePricingData>({
        defaultPrice: pricing.defaultPrice,
        discountPercent: pricing.discountPercent || 0,
        isDiscountActive: pricing.isDiscountActive,
        discountStartDate: pricing.discountStartDate ? new Date(pricing.discountStartDate).toISOString().slice(0, 16) : '',
        discountEndDate: pricing.discountEndDate ? new Date(pricing.discountEndDate).toISOString().slice(0, 16) : ''
    })

    useEffect(() => {
        if (pricing) {
            setFormData({
                defaultPrice: pricing.defaultPrice,
                discountPercent: pricing.discountPercent || 0,
                isDiscountActive: pricing.isDiscountActive,
                discountStartDate: pricing.discountStartDate ? new Date(pricing.discountStartDate).toISOString().slice(0, 16) : '',
                discountEndDate: pricing.discountEndDate ? new Date(pricing.discountEndDate).toISOString().slice(0, 16) : ''
            })
        }
    }, [pricing])

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

    const handleInputChange = (field: keyof UpdatePricingData, value: any) => {
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
                        Edit Pricing
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
                            <Label htmlFor="defaultPrice">Default Price ($)</Label>
                            <Input
                                id="defaultPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.defaultPrice}
                                onChange={(e) => handleInputChange('defaultPrice', parseFloat(e.target.value))}
                                placeholder="1.00"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="discountPercent">Discount Percent (%)</Label>
                            <Input
                                id="discountPercent"
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={formData.discountPercent}
                                onChange={(e) => handleInputChange('discountPercent', parseFloat(e.target.value))}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isDiscountActive">Discount Active</Label>
                            <Switch
                                id="isDiscountActive"
                                checked={formData.isDiscountActive}
                                onCheckedChange={(checked) => handleInputChange('isDiscountActive', checked)}
                            />
                        </div>
                    </div>

                    {formData.isDiscountActive && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="discountStartDate">Discount Start Date</Label>
                                <Input
                                    id="discountStartDate"
                                    type="datetime-local"
                                    value={formData.discountStartDate}
                                    onChange={(e) => handleInputChange('discountStartDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="discountEndDate">Discount End Date</Label>
                                <Input
                                    id="discountEndDate"
                                    type="datetime-local"
                                    value={formData.discountEndDate}
                                    onChange={(e) => handleInputChange('discountEndDate', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

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
                            {loading ? 'Saving...' : 'Update Pricing'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
} 