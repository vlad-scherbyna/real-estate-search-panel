import { useMemo, useState, useEffect, useRef } from 'react'
import { useSearchStore } from '@/store/search'
import { SearchFilter, SearchResponse, SearchMode } from '@/types/tenement-api'
import { useTenementSearch } from '@/api/tenement/tenement'
import { useUrlSync } from '@/hooks/use-url-sync'

export function useSearch() {
  const { filters, selectedDistrictIds } = useSearchStore()
  const [searchResults, setSearchResults] = useState<SearchResponse>()
  const previousMode = useRef(filters.mode)

  const { syncAllToUrl } = useUrlSync()
  const searchMutation = useTenementSearch()

  // Convert filter for API format
  const apiFilter: SearchFilter = useMemo(() => {
    const filter: SearchFilter = {
      rentType: [filters.mode === SearchMode.AI ? SearchMode.RENT : filters.mode],
      status: 'active',
      locationAccuracy: [9, 5, 1, 0],
    }

    if (selectedDistrictIds.length > 0) {
      filter.withinId = selectedDistrictIds
    } else if (filters.location && selectedDistrictIds.length === 0) {
      filter.search = filters.location
    }

    return filter
  }, [filters.mode, filters.location, selectedDistrictIds])

  // Auto-search when mode changes (but not on initial render)
  useEffect(() => {
    if (previousMode.current !== filters.mode) {
      searchMutation.mutate({
        filter: apiFilter,
        page: 1,
        pageSize: 20,
      }, {
        onSuccess: (data) => {
          setSearchResults(data)
        }
      })
    }
    previousMode.current = filters.mode
  }, [filters.mode, apiFilter, searchMutation])

  const handleSearch = () => {
    syncAllToUrl()

    searchMutation.mutate({
      filter: apiFilter,
      page: 1,
      pageSize: 20,
    }, {
      onSuccess: (data) => {
        setSearchResults(data)
      }
    })
  }

  return {
    searchResults,
    isLoading: searchMutation.isPending,
    handleSearch,
  }
}
