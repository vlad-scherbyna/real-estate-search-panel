import { useQuery } from '@tanstack/react-query'
import { geoApi } from './api'

// Query keys
const geoKeys = {
  all: ['geo'] as const,
  recentSearches: () => [...geoKeys.all, 'recent-searches'],
  popularBoundaries: () => [...geoKeys.all, 'popular-boundaries'],
}

// Hook for recent searches
export const useRecentSearches = () => {
  return useQuery({
    queryKey: geoKeys.recentSearches(),
    queryFn: geoApi.getRecentSearches,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for popular boundaries
export const usePopularBoundaries = () => {
  return useQuery({
    queryKey: geoKeys.popularBoundaries(),
    queryFn: geoApi.getPopularBoundaries,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// Export query keys for invalidation
export { geoKeys }
