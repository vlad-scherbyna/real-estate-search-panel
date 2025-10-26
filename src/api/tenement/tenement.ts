import { useQuery } from '@tanstack/react-query'
import { tenementApi } from './api';
import { SearchFilter } from '@/types/tenement-api'

const tenementKeys = {
  all: ['tenement'] as const,
  search: (filter: SearchFilter, page: number, pageSize: number) =>
    [...tenementKeys.all, 'search', filter, page, pageSize] as const,
  count: (filter: SearchFilter) => [...tenementKeys.all, 'count', filter] as const,
}

// Main search hook
export const useTenementSearch = (filter: SearchFilter, page = 1, pageSize = 20, enabled = false) => {
  return useQuery({
    queryKey: tenementKeys.search(filter, page, pageSize),
    queryFn: () => tenementApi.search(filter, page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && !!filter.rentType?.length, // Only search when enabled and rent type is selected
  })
}

// Count hook (for displaying total results)
export const useTenementCount = (filter: SearchFilter) => {
  return useQuery({
    queryKey: tenementKeys.count(filter),
    queryFn: () => tenementApi.getTenementCount(filter),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!filter.rentType?.length, // Only fetch if rent type is selected
  })
}

export { tenementKeys }
