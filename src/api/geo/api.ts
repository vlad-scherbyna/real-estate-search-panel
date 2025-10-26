import { apiClient } from '../api-client'
import { RecentSearchItem, PopularBoundaryItem } from '@/types/geo-api'

export const geoApi = {
  // Get recent searches
  getRecentSearches: async (): Promise<RecentSearchItem[]> => {
    const response = await apiClient.get('/geo/search/recent')
    return response.data
  },

  // Get popular boundaries (cities/districts)
  getPopularBoundaries: async (): Promise<PopularBoundaryItem[]> => {
    const response = await apiClient.get('/geo/boundary/popular')
    return response.data
  },
}
