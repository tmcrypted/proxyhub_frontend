import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Users, Shield, UserCheck, UserX } from 'lucide-react'
import { useUsers } from '../model/selectors'

export const UserStats = () => {
    const { t } = useTranslation()
    const users = useUsers()

    const totalUsers = users.length
    const adminUsers = users.filter(user => user.role === 'ADMIN').length
    const verifiedUsers = users.filter(user => user.isVerified).length
    const unverifiedUsers = totalUsers - verifiedUsers

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        All registered users
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Admins
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{adminUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Administrator accounts
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Verified Users
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{verifiedUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Email verified accounts
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Unverified Users
                    </CardTitle>
                    <UserX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{unverifiedUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Pending verification
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 