import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, User as UserIcon, Shield } from 'lucide-react'
import type { User } from '../model/types'

interface UserTableProps {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (id: number) => void
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
    const { t } = useTranslation()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const getRoleBadge = (role: User['role']) => {
        if (role === 'ADMIN') {
            return (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full whitespace-nowrap">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full whitespace-nowrap">
                <UserIcon className="w-3 h-3 mr-1" />
                User
            </span>
        )
    }

    const getAuthProviderBadge = (provider: User['authProvider']) => {
        const colors: Record<User['authProvider'], string> = {
            EMAIL: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
            GOOGLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            WALLET: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
        }
        
        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${colors[provider]}`}>
                {provider}
            </span>
        )
    }

    const getStatusBadge = (verified: boolean) => {
        if (verified) {
            return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full whitespace-nowrap">Verified</span>
        }
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full whitespace-nowrap">Unverified</span>
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <div className="min-h-[400px] transition-all duration-200">
                    {users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No users found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-3 py-2 font-medium w-16">ID</th>
                                    <th className="px-3 py-2 font-medium">Name</th>
                                    <th className="px-3 py-2 font-medium">Email</th>
                                    <th className="px-3 py-2 font-medium w-32">Role</th>
                                    <th className="px-3 py-2 font-medium w-24">Auth</th>
                                    <th className="px-3 py-2 font-medium w-20">Status</th>
                                    <th className="px-3 py-2 font-medium w-32">Proxies</th>
                                    <th className="px-3 py-2 font-medium w-32">Orders</th>
                                    <th className="px-3 py-2 font-medium w-32">Created</th>
                                    <th className="px-3 py-2 font-medium w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 h-12">
                                        <td className="px-3 py-2 text-sm font-medium w-16">#{user.id}</td>
                                        <td className="px-3 py-2">
                                            <span className="text-sm font-medium">
                                                {user.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="text-sm">
                                                {user.email || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 w-32">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            {getAuthProviderBadge(user.authProvider)}
                                        </td>
                                        <td className="px-3 py-2 w-20">
                                            {getStatusBadge(user.isVerified)}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {user._count?.Proxy || 0}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {user._count?.Order || 0}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(user)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDelete(user.id)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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