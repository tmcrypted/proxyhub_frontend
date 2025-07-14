import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { Branch } from '../model/types'

interface BranchTableProps {
    branches: Branch[]
    onEdit: (branch: Branch) => void
    onDelete: (id: number) => void
}

export const BranchTable = ({ branches, onEdit, onDelete }: BranchTableProps) => {
    const { t } = useTranslation()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <div className="min-h-[400px] transition-all duration-200">
                    {branches.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No branches found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-3 py-2 font-medium w-16">ID</th>
                                    <th className="px-3 py-2 font-medium">Comment</th>
                                    <th className="px-3 py-2 font-medium w-32">Created</th>
                                    <th className="px-3 py-2 font-medium w-32">Updated</th>
                                    <th className="px-3 py-2 font-medium w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {branches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 h-12">
                                        <td className="px-3 py-2 text-sm font-medium w-16">#{branch.id}</td>
                                        <td className="px-3 py-2">
                                            <span className="text-sm">
                                                {branch.comment || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {formatDate(branch.createdAt)}
                                        </td>
                                        <td className="px-3 py-2 text-sm w-32">
                                            {formatDate(branch.updatedAt)}
                                        </td>
                                        <td className="px-3 py-2 w-24">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(branch)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDelete(branch.id)}
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