
import { apiClient } from '../api-client'
import { SearchFilter, SearchRequest, SearchResponse, TenementCount } from '@/types/tenement-api'

// Helper function to convert our simplified filter to full API request
const buildSearchRequest = (filter: SearchFilter, page = 1, pageSize = 20): SearchRequest => {
  const request: SearchRequest = {
    filter: {
      status: 'active',
      locationAccuracy: 'active',
    },
    sort: {
      createdAt: 'desc', // Default sort by newest
    },
    paging: {
      pageSize,
      page,
    }
  }

  // Add our filters
  if (filter.withinId?.length) {
    request.filter.withinId = filter.withinId
  }

  if (filter.type?.length) {
    request.filter.type = filter.type
  }

  if (filter.rentType?.length) {
    request.filter.rentType = filter.rentType
  }

  if (filter.rent) {
    request.filter.rent = filter.rent
  }

  if (filter.search) {
    request.filter.search = filter.search
  }

  return request
}

export const tenementApi = {
  // Main search endpoint
  search: async (filter: SearchFilter, page = 1, pageSize = 20): Promise<SearchResponse> => {
    try {
      const searchRequest = buildSearchRequest(filter, page, pageSize)
      console.log('🔍 Search request:', searchRequest)

      const response = await apiClient.post('/tenement/search', searchRequest)
      return response.data
    } catch (error) {
      console.error('Failed to search tenements:', error)
      throw error
    }
  },

  // Count endpoint - теперь также использует полный SearchRequest
  getTenementCount: async (filter: SearchFilter): Promise<TenementCount> => {
    try {
      const searchRequest = buildSearchRequest(filter, 1, 1) // Minimal paging for count
      console.log('📊 Count request:', searchRequest)

      const response = await apiClient.post('/tenement/search/count', searchRequest)
      return response.data
    } catch (error) {
      console.error('Failed to fetch tenement count:', error)
      throw error
    }
  },
}