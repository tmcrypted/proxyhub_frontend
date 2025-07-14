import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import type { ProxyFilters } from '../model/types'

interface ProxyFiltersComponentProps {
    filters: ProxyFilters
    onFiltersChange: (filters: ProxyFilters) => void
}

export const ProxyFiltersComponent = ({ filters, onFiltersChange }: ProxyFiltersComponentProps) => {
    const handleFilterChange = (key: keyof ProxyFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        })
    }

    const clearFilters = () => {
        onFiltersChange({})
    }

    const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="branchId">Branch ID</Label>
                        <Input
                            id="branchId"
                            type="number"
                            value={filters.branchId || ''}
                            onChange={(e) => handleFilterChange('branchId', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="Branch ID"
                        />
                    </div>
                    <div>
                        <Label htmlFor="userId">User ID</Label>
                        <Input
                            id="userId"
                            type="number"
                            value={filters.userId || ''}
                            onChange={(e) => handleFilterChange('userId', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="User ID"
                        />
                    </div>
                    <div>
                        <Label htmlFor="countryId">Country</Label>
                        <Select
                            value={filters.countryId?.toString() || 'all'}
                            onValueChange={(value) => handleFilterChange('countryId', value === 'all' ? undefined : parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All countries" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All countries</SelectItem>
                                <SelectItem value="1">US - United States</SelectItem>
                                <SelectItem value="2">GB - United Kingdom</SelectItem>
                                <SelectItem value="3">DE - Germany</SelectItem>
                                <SelectItem value="4">FR - France</SelectItem>
                                <SelectItem value="5">NL - Netherlands</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="proxyStatus">Status</Label>
                        <Select
                            value={filters.proxyStatus || 'all'}
                            onValueChange={(value) => handleFilterChange('proxyStatus', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <Label htmlFor="proxyType">Type</Label>
                        <Select
                            value={filters.proxyType || 'all'}
                            onValueChange={(value) => handleFilterChange('proxyType', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                                <SelectItem value="DATACENTER">Datacenter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="proxyProtocol">Protocol</Label>
                        <Select
                            value={filters.proxyProtocol || 'all'}
                            onValueChange={(value) => handleFilterChange('proxyProtocol', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All protocols" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All protocols</SelectItem>
                                <SelectItem value="HTTP">HTTP</SelectItem>
                                <SelectItem value="HTTPS">HTTPS</SelectItem>
                                <SelectItem value="SOCKS4">SOCKS4</SelectItem>
                                <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 