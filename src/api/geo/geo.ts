import { useQuery } from '@tanstack/react-query'
import { geoApi } from './api'
import { LocationSuggestion, RecentSearchItem, PopularBoundaryItem } from '@/types/geo-api'

// Query keys
const geoKeys = {
  all: ['geo'] as const,
  recentSearches: () => [...geoKeys.all, 'recent-searches'] as const,
  popularBoundaries: () => [...geoKeys.all, 'popular-boundaries'] as const,
}

// Transform recent searches - просто name
function transformRecentSearches(recentItems: RecentSearchItem[]): LocationSuggestion[] {
  return recentItems.map(item => ({
    id: item.mapboxId,
    name: item.name,
    type: 'recent' as const,
    location: item.pt,
  }))
}

// Transform popular boundaries - altName + children count
function transformPopularBoundaries(popularItems: PopularBoundaryItem[]): LocationSuggestion[] {
  return popularItems.map(item => ({
    id: item.id,
    name: item.altName,
    type: 'popular' as const,
    label: `${item.children.length} districts`, // показываем кол-во районов
  }))
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

// Combined hook using individual queries
export const useCombinedLocationSuggestions = () => {
  const recentQuery = useRecentSearches()
  const popularQuery = usePopularBoundaries()

  // Combine the data
  const suggestions: LocationSuggestion[] = []

  if (recentQuery.data) {
    suggestions.push(...transformRecentSearches(recentQuery.data))
  }

  if (popularQuery.data) {
    suggestions.push(...transformPopularBoundaries(popularQuery.data))
  }

  return {
    data: suggestions,
    isLoading: recentQuery.isLoading || popularQuery.isLoading,
    error: recentQuery.error || popularQuery.error,
    isSuccess: recentQuery.isSuccess && popularQuery.isSuccess,
  }
}

// Export query keys for invalidation
export { geoKeys }
