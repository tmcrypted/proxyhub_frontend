import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import type { Branch, CreateBranchData, UpdateBranchData } from '../model/types'

interface BranchFormProps {
    branch?: Branch | null
    onSubmit: (data: CreateBranchData | UpdateBranchData) => Promise<void>
    onCancel: () => void
}

export const BranchForm = ({ branch, onSubmit, onCancel }: BranchFormProps) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateBranchData>({
        comment: ''
    })

    useEffect(() => {
        if (branch) {
            setFormData({
                comment: branch.comment || ''
            })
        }
    }, [branch])

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

    const handleInputChange = (field: keyof CreateBranchData, value: any) => {
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
                        {branch ? 'Edit Branch' : 'Add New Branch'}
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
                    <div>
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            value={formData.comment}
                            onChange={(e) => handleInputChange('comment', e.target.value)}
                            placeholder="Enter branch comment..."
                            rows={3}
                        />
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
                            {loading ? 'Saving...' : (branch ? 'Update Branch' : 'Create Branch')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
} 