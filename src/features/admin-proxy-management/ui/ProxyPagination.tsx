import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProxyStore } from '../model/store'
import { usePaginationInfo } from '../model/selectors'

export const ProxyPagination = () => {
  const { setPage, setItemsPerPage } = useProxyStore()
  const pagination = usePaginationInfo()

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
  }

  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between space-x-2 py-4 transition-all duration-200">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Показано {pagination.startIndex}-{pagination.endIndex} из {pagination.totalItems}
        </span>
        <Select value={pagination.itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">на странице</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="transition-all duration-150"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNumber: number
            
            if (pagination.totalPages <= 5) {
              pageNumber = i + 1
            } else if (pagination.currentPage <= 3) {
              pageNumber = i + 1
            } else if (pagination.currentPage >= pagination.totalPages - 2) {
              pageNumber = pagination.totalPages - 4 + i
            } else {
              pageNumber = pagination.currentPage - 2 + i
            }

            return (
              <Button
                key={pageNumber}
                variant={pagination.currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="w-8 h-8 transition-all duration-150"
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="transition-all duration-150"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 