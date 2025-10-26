import { useMutation } from '@tanstack/react-query'
import { tenementApi } from './api'
import { SearchFilter } from '@/types/tenement-api'

// Query keys
const tenementKeys = {
  all: ['tenement'] as const,
  search: (filter: SearchFilter, page: number, pageSize: number) =>
    [...tenementKeys.all, 'search', filter, page, pageSize] as const,
  count: (filter: SearchFilter) =>
    [...tenementKeys.all, 'count', filter] as const,
}

// Hook for tenement search with mutation (triggered manually)
export const useTenementSearch = () => {
  return useMutation({
    mutationFn: ({ filter, page = 1, pageSize = 20 }: {
      filter: SearchFilter
      page?: number
      pageSize?: number
    }) => tenementApi.search(filter, page, pageSize),
  })
}

// Export query keys for invalidation
export { tenementKeys }
