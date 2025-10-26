import { useMutation, useQuery } from '@tanstack/react-query'
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
    onSuccess: (data, variables) => {
      console.log('🎉 Search completed:', data)
      console.log('📋 Search variables:', variables)
    },
    onError: (error, variables) => {
      console.error('❌ Search failed:', error)
      console.error('📋 Search variables:', variables)
    },
  })
}

// Hook for background search query (auto-updating)
export const useTenementSearchQuery = (filter: SearchFilter, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: tenementKeys.search(filter, page, pageSize),
    queryFn: () => tenementApi.search(filter, page, pageSize),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Disabled by default, enable manually when needed
  })
}

// Export query keys for invalidation
export { tenementKeys }
