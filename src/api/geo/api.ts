import { apiClient } from '../api-client'
import { PopularBoundary, RecentSearch } from "@/types/geo-api";

export const geoApi = {
  // Get recent searches
  getRecentSearches: async (): Promise<RecentSearch[]> => {
    const response = await apiClient.get('/geo/search/recent')
    return response.data
  },

  // Get popular boundaries (cities/districts)
  getPopularBoundaries: async (): Promise<PopularBoundary[]> => {
    const response = await apiClient.get('/geo/boundaries/popular')
    return response.data
  },
}
