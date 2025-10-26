
import { useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchStore } from '@/store/search'
import { SearchMode } from '@/types/tenement-api'

export const useUrlSync = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, updateFilter } = useSearchStore()
  const isInitialLoad = useRef(true)

  // Helper function to build URL params
  const buildUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.mode) {
      params.set('mode', filters.mode)
    }

    if (filters.location?.trim()) {
      params.set('location', filters.location.trim())
    }

    return params.toString() ? `?${params.toString()}` : window.location.pathname
  }, [filters.mode, filters.location])

  // Sync URL params to store on mount/URL change (only from URL changes)
  useEffect(() => {
    const mode = searchParams.get('mode')
    const location = searchParams.get('location')

    if (mode && Object.values(SearchMode).includes(mode as SearchMode) && mode !== filters.mode) {
      updateFilter('mode', mode as SearchMode)
    }

    if (location !== null && location !== filters.location) {
      updateFilter('location', location)
    }

    isInitialLoad.current = false
  }, [searchParams, updateFilter])

  // Sync store to URL only after initial load and not during URL->store sync
  useEffect(() => {
    if (isInitialLoad.current) return

    const url = buildUrlParams()
    router.replace(url, { scroll: false })
  }, [filters.mode, filters.location, buildUrlParams, router])

  // Manual sync function
  const syncAllToUrl = useCallback(() => {
    const url = buildUrlParams()
    router.replace(url, { scroll: false })
  }, [buildUrlParams, router])

  return { syncAllToUrl }
}