import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, DollarSign, Percent, Calendar } from 'lucide-react'
import type { Pricing } from '../model/types'

interface PricingTableProps {
    pricingHistory: Pricing[]
    onEdit: (pricing: Pricing) => void
}

export const PricingTable = ({ pricingHistory, onEdit }: PricingTableProps) => {
    const { t } = useTranslation()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    const getDiscountStatusBadge = (isActive: boolean) => {
        if (isActive) {
            return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full whitespace-nowrap">Active</span>
        }
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full whitespace-nowrap">Inactive</span>
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <div className="min-h-[400px] transition-all duration-200">
                    {pricingHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No pricing history
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Pricing history will appear here once you create or update pricing.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-3 py-2 font-medium w-16">ID</th>
                                    <th className="px-3 py-2 font-medium w-24">Price</th>
                                    <th className="px-3 py-2 font-medium w-24">Discount</th>
                                    <th className="px-3 py-2 font-medium w-24">Status</th>
                                    <th className="px-3 py-2 font-medium w-32">Start Date</th>
                                    <th className="px-3 py-2 font-medium w-32">End Date</th>
                                    <th className="px-3 py-2 font-medium w-32">Created</th>
                                    <th className="px-3 py-2 font-medium w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pricingHistory.map((pricing) => (
                                    <tr key={pricing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 h-12">
                                        <td className="px-3 py-2 text-sm font-medium w-16">#{pricing.id}</td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-medium">
                                                    {pricing.defaultPrice}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <Percent className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm">
                                                    {pricing.discountPercent || 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            {getDiscountStatusBadge(pricing.isDiscountActive)}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {pricing.discountStartDate ? formatDateTime(pricing.discountStartDate) : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {pricing.discountEndDate ? formatDateTime(pricing.discountEndDate) : '-'}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {formatDate(pricing.createdAt)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(pricing)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
} 