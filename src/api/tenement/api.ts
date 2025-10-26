import { apiClient } from '../api-client'
import { SearchFilter, SearchRequest, SearchResponse } from '@/types/tenement-api'

// Helper function to build search request
const buildSearchRequest = (filter: SearchFilter, page = 1, pageSize = 20): SearchRequest => {
  const request: SearchRequest = {
    filter: {
      status: 'active',
      locationAccuracy: [9, 5, 1, 0], // Proper array format instead of 'active'
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

  // Override locationAccuracy if provided in filter
  if (filter.locationAccuracy?.length) {
    request.filter.locationAccuracy = filter.locationAccuracy
  }

  return request
}

export const tenementApi = {
  // Search tenements
  search: async (filter: SearchFilter, page = 1, pageSize = 20): Promise<SearchResponse> => {
    const searchRequest = buildSearchRequest(filter, page, pageSize)

    const response = await apiClient.post('/tenement/search', searchRequest)
    return response.data
  },
}
