'use client'

import { Toggles } from './toggles'
import { LocationField } from './location-field'
import { CategoryField } from './category-field'
import { PriceField } from './price-field'
import { cn } from '@/lib/utils'
import { useSearchStore } from '@/store/search'
import { useMemo, useState } from 'react'
import { SearchFilter, SearchResponse } from '@/types/tenement-api'
import { tenementApi } from "@/api/tenement/api";
import { useTenementCount } from "@/api/tenement";

export interface SearchBarProps {
  className?: string
  onSearch?: (filter: SearchFilter) => void
  onResults?: (results: SearchResponse) => void
}

export function SearchBar({ className, onSearch, onResults }: SearchBarProps) {
  const { filters, selectedDistrictIds } = useSearchStore()
  const [isSearching, setIsSearching] = useState(false)

  // Конвертируем наши фильтры в формат API
  const apiFilter: SearchFilter = useMemo(() => {
    const filter: SearchFilter = {
      rentType: [filters.mode === 'ai' ? 'rent' : filters.mode],
      status: 'active',
    }

    // Добавляем district IDs если есть
    if (selectedDistrictIds.length > 0) {
      filter.withinId = selectedDistrictIds
    }

    // Добавляем category если выбран
    if (filters.category) {
      filter.type = [parseInt(filters.category)]
    }

    // Добавляем location как search term если нет district ID
    if (filters.location && selectedDistrictIds.length === 0) {
      filter.search = filters.location
    }

    return filter
  }, [filters.mode, filters.category, filters.location, selectedDistrictIds])

  // Автоматически обновляем count при изменении фильтров
  const { data: countData, isLoading: isLoadingCount, error: countError } = useTenementCount(apiFilter)

  // Прямое выполнение поиска без state management
  const handleSearch = async () => {
    console.log('🔍 Starting search with:')
    console.log('  - Filters:', filters)
    console.log('  - API Filter:', apiFilter)
    console.log('  - Selected District IDs:', selectedDistrictIds)

    setIsSearching(true)

    try {
      // Прямой вызов API
      const searchResult = await tenementApi.search(apiFilter, 1, 20)

      console.log('📊 Search completed:', searchResult)

      // Вызываем callbacks
      if (onSearch) {
        onSearch(apiFilter)
      }

      if (onResults) {
        onResults(searchResult)
      }

    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const getResultsText = () => {
    if (filters.mode === 'ai') {
      return 'AI-matched properties'
    }
    return `properties for ${filters.mode}`
  }

  const getLocationText = () => {
    if (filters.location) {
      return ` in ${filters.location}`
    }
    return ''
  }

  const getCategoryText = () => {
    if (filters.category) {
      return ` • Selected category`
    }
    return ''
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toLocaleString()
  }

  const getButtonColor = () => {
    switch (filters.mode) {
      case 'rent':
        return 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500'
      case 'buy':
        return 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
      case 'ai':
        return 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500'
    }
  }

  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      {/* Header with toggles */}
      <div className="mb-6">
        <Toggles />
      </div>

      {/* Main search container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Search fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
          {/* Location Field */}
          <div className="bg-white p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <LocationField />
          </div>

          {/* Category Field */}
          <div className="bg-white p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <CategoryField />
          </div>

          {/* Price Field */}
          <div className="bg-white p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <PriceField />
          </div>

          {/* Search Button */}
          <div className="bg-white p-4 flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3',
                'font-semibold text-white rounded-lg',
                'transition-all duration-200 shadow-md hover:shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                getButtonColor()
              )}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {isSearching ? 'Searching...' : 'Search'}
              </span>
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {isLoadingCount ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                <span className="font-semibold text-gray-900">Loading...</span>
              </span>
            ) : countError ? (
              <span className="font-semibold text-red-600">Error loading count</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">
                  {formatCount(countData?.count || 0)}
                </span>
                {' '}verified listings for {getResultsText()}{getLocationText()}{getCategoryText()}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}