import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { DollarSign, Percent, TrendingUp, History } from 'lucide-react'
import { useCurrentPricing, usePricingHistory } from '../model/selectors'

export const PricingStats = () => {
    const { t } = useTranslation()
    const currentPricing = useCurrentPricing()
    const pricingHistory = usePricingHistory()

    // Если данных нет, показываем заглушку
    if (!currentPricing) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Loading...
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">
                                No data available
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const totalPricingRecords = pricingHistory.length
    const hasActiveDiscount = currentPricing?.isDiscountActive || false
    const currentPrice = currentPricing?.defaultPrice || 0
    const currentDiscount = currentPricing?.discountPercent || 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Current Price
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${currentPrice}</div>
                    <p className="text-xs text-muted-foreground">
                        Per proxy
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Current Discount
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentDiscount}%</div>
                    <p className="text-xs text-muted-foreground">
                        {hasActiveDiscount ? 'Active' : 'Inactive'}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Discount Status
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {hasActiveDiscount ? 'Active' : 'Inactive'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {hasActiveDiscount ? 'Discount is running' : 'No active discount'}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pricing Records
                    </CardTitle>
                    <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPricingRecords}</div>
                    <p className="text-xs text-muted-foreground">
                        Total history entries
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 