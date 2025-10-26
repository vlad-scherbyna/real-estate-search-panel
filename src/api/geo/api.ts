import { apiClient } from '../api-client'
import { RecentSearchItem, PopularBoundaryItem } from '@/types/geo-api'

export const geoApi = {
  // Get recent searches
  getRecentSearches: async (): Promise<RecentSearchItem[]> => {
    const response = await apiClient.get('/geo/search/recent')
    return response.data
  },

  // Get popular boundaries (cities/districts) with optional search
  getPopularBoundaries: async (search?: string): Promise<PopularBoundaryItem[]> => {
    const params = search ? { search } : {}
    const response = await apiClient.get('/geo/boundary/popular', { params })
    return response.data
  },
}
