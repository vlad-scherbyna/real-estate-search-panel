import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchFilters } from '@/types'
import { useSearchStore } from "@/store/search";

export const useUrlSync = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, setFilters, isDirty } = useSearchStore()

  // Sync URL to store on mount, and URL changes
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {}

    const mode = searchParams.get('mode') as SearchFilters['mode']
    if (mode && ['rent', 'buy', 'ai'].includes(mode)) {
      urlFilters.mode = mode
    }

    const location = searchParams.get('location')
    if (location) urlFilters.location = location

    const category = searchParams.get('category')
    if (category) urlFilters.category = category

    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    if (priceMin && priceMax) {
      urlFilters.priceRange = [parseInt(priceMin), parseInt(priceMax)]
    }

    const rooms = searchParams.get('rooms')
    if (rooms) urlFilters.rooms = parseInt(rooms)

    const type = searchParams.get('type') as SearchFilters['type']
    if (type && ['apartment', 'house', 'commercial'].includes(type)) {
      urlFilters.type = type
    }

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters)
    }
  }, [searchParams, setFilters])

  // Sync store to URL when filters change
  useEffect(() => {
    if (!isDirty) return

    const params = new URLSearchParams()

    if (filters.mode) params.set('mode', filters.mode)
    if (filters.location) params.set('location', filters.location)
    if (filters.category) params.set('category', filters.category)
    if (filters.priceRange) {
      params.set('priceMin', filters.priceRange[0].toString())
      params.set('priceMax', filters.priceRange[1].toString())
    }
    if (filters.rooms) params.set('rooms', filters.rooms.toString())
    if (filters.type) params.set('type', filters.type)

    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : '/'

    router.replace(url, { scroll: false })
  }, [filters, isDirty, router])
}
