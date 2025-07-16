import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ShoppingCart, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useOrders } from '../model/selectors'

export const OrderStats = () => {
    const { t } = useTranslation()
    const orders = useOrders()

    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length
    const activeOrders = orders.filter(order => order.status === 'ACTIVE').length
    const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        All orders
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pending Orders
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting payment
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Orders
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Paid and active
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Cancelled Orders
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{cancelledOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Cancelled orders
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total earnings
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 