import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchStore } from '@/store/search'

export const useUrlSync = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, updateFilter, isDirty } = useSearchStore()

  // Sync URL to store on mount and URL changes
  useEffect(() => {
    let hasUpdates = false

    // Mode (rent/buy/ai)
    const mode = searchParams.get('mode')
    if (mode && ['rent', 'buy', 'ai'].includes(mode) && mode !== filters.mode) {
      updateFilter('mode', mode as 'rent' | 'buy' | 'ai')
      hasUpdates = true
    }

    // Location
    const location = searchParams.get('location')
    if (location && location !== filters.location) {
      updateFilter('location', location)
      hasUpdates = true
    }

    // Category
    const category = searchParams.get('category')
    if (category && category !== filters.category) {
      updateFilter('category', category)
      hasUpdates = true
    }

    // Price range
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    if (priceMin && priceMax) {
      const currentPriceRange = filters.priceRange
      const newPriceRange: [number, number] = [parseInt(priceMin), parseInt(priceMax)]

      if (!currentPriceRange ||
        currentPriceRange[0] !== newPriceRange[0] ||
        currentPriceRange[1] !== newPriceRange[1]) {
        updateFilter('priceRange', newPriceRange)
        hasUpdates = true
      }
    }

    // Only update if we actually have changes to prevent infinite loops
    console.log('URL sync: hasUpdates =', hasUpdates)
  }, [searchParams, updateFilter, filters.mode, filters.location, filters.category, filters.priceRange])

  // Sync store to URL when filters change
  useEffect(() => {
    if (!isDirty) return

    const params = new URLSearchParams()

    // Add non-empty filter values to URL
    if (filters.mode && filters.mode !== 'ai') {
      params.set('mode', filters.mode)
    }

    if (filters.location) {
      params.set('location', filters.location)
    }

    if (filters.category) {
      params.set('category', filters.category)
    }

    if (filters.priceRange) {
      params.set('priceMin', filters.priceRange[0].toString())
      params.set('priceMax', filters.priceRange[1].toString())
    }

    // Build URL
    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : window.location.pathname

    // Update URL without causing a navigation
    router.replace(url, { scroll: false })

    console.log('Syncing filters to URL:', url)
  }, [filters.mode, filters.location, filters.category, filters.priceRange, isDirty, router])
}
