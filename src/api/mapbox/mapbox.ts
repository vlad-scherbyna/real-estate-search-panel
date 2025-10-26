import { useQuery } from '@tanstack/react-query'
import { mapboxApi } from './api'

const mapboxKeys = {
  all: ['mapbox'],
  search: (query: string) => [...mapboxKeys.all, 'search', query],
}

export const useMapboxSearch = (query: string, enabled = true) => {
  return useQuery({
    queryKey: mapboxKeys.search(query),
    queryFn: () => mapboxApi.searchAddresses(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export { mapboxKeys }
