import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { GitBranch } from 'lucide-react'
import { useBranches } from '../model/selectors'

export const BranchStats = () => {
    const { t } = useTranslation()
    const branches = useBranches()

    const totalBranches = branches.length

    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Branches
                    </CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBranches}</div>
                    <p className="text-xs text-muted-foreground">
                        Active branches in the system
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 