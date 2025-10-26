import { useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchStore } from '@/store/search'

export const useUrlSync = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, updateFilter } = useSearchStore()
  const isInitialLoad = useRef(true)

  // Helper function to build URL params
  const buildUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.mode && filters.mode !== 'ai') {
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

    if (mode && ['rent', 'buy', 'ai'].includes(mode) && mode !== filters.mode) {
      updateFilter('mode', mode as 'rent' | 'buy' | 'ai')
    }

    if (location !== null && location !== filters.location) {
      updateFilter('location', location)
    }

    isInitialLoad.current = false
  }, [filters.location, filters.mode, searchParams, updateFilter])

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