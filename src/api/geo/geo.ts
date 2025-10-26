import { useQuery } from '@tanstack/react-query'
import { geoApi } from './api'
import { LocationSuggestion, RecentSearchItem, PopularBoundaryItem, LocationType } from '@/types/geo-api'

// Query keys
const geoKeys = {
  all: ['geo'],
  recentSearches: () => [...geoKeys.all, 'recent-searches'],
  popularBoundaries: (search?: string) => [...geoKeys.all, 'popular-boundaries', search || 'all'],
}

// Transform recent searches - просто name
function transformRecentSearches(recentItems: RecentSearchItem[]): LocationSuggestion[] {
  return recentItems.map(item => ({
    id: item.mapboxId,
    name: item.name,
    type: LocationType.RECENT,
    location: item.pt,
  }))
}

// Transform popular boundaries - altName + children count
function transformPopularBoundaries(popularItems: PopularBoundaryItem[]): LocationSuggestion[] {
  return popularItems.map(item => ({
    id: item.id,
    name: item.altName,
    type: LocationType.POPULAR,
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

// Hook for popular boundaries with search support
export const usePopularBoundaries = (search?: string) => {
  return useQuery({
    queryKey: geoKeys.popularBoundaries(search),
    queryFn: () => geoApi.getPopularBoundaries(search),
    staleTime: search ? 30 * 1000 : 30 * 60 * 1000, // Shorter cache for search results
    gcTime: search ? 2 * 60 * 1000 : 60 * 60 * 1000, // Shorter GC for search results
    enabled: true, // Always enabled, but will use different cache keys
  })
}

// Combined hook using individual queries with search support
export const useCombinedLocationSuggestions = (searchQuery?: string) => {
  const recentQuery = useRecentSearches()
  const popularQuery = usePopularBoundaries(searchQuery)

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

// Hook specifically for popular boundaries search (used separately if needed)
export const usePopularBoundariesSearch = (search: string) => {
  return useQuery({
    queryKey: geoKeys.popularBoundaries(search),
    queryFn: () => geoApi.getPopularBoundaries(search),
    staleTime: 30 * 1000, // 30 seconds for search results
    gcTime: 2 * 60 * 1000, // 2 minutes
    enabled: search.length >= 2, // Only search when query is at least 2 characters
  })
}

// Export query keys for invalidation
export { geoKeys }
