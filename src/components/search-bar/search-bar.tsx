'use client'

import { Toggles } from './toggles'
import { LocationField } from './location-field'
import { CategoryField } from './category-field'
import { PriceField } from './price-field'
import { cn } from '@/lib/utils'
import { useSearchStore } from '@/store/search'
import { useMemo } from 'react'
import { SearchFilter } from '@/types/tenement-api'
import { useTenementCount, useTenementSearch } from '@/api/tenement/tenement'

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { filters, selectedDistrictIds } = useSearchStore()

  // Hook for search mutation
  const searchMutation = useTenementSearch()

  // Конвертируем наши фильтры в формат API
  const apiFilter: SearchFilter = useMemo(() => {
    const filter: SearchFilter = {
      rentType: [filters.mode === 'ai' ? 'rent' : filters.mode],
      status: 'active',
      locationAccuracy: [9, 5, 1, 0],
    }

    if (selectedDistrictIds.length > 0) {
      filter.withinId = selectedDistrictIds
    }

    if (filters.location && selectedDistrictIds.length === 0) {
      filter.search = filters.location
    }

    return filter
  }, [filters.mode, filters.location, selectedDistrictIds])

  const { data: countData, isLoading: isLoadingCount } = useTenementCount(apiFilter)

  const handleSearch = () => {
    searchMutation.mutate({
      filter: apiFilter,
      page: 1,
      pageSize: 20,
    })
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

          {/* Property Type Field */}
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
              disabled={searchMutation.isPending}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3',
                'font-semibold text-white rounded-lg',
                'transition-all duration-200 shadow-md hover:shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                getButtonColor()
              )}
            >
              {searchMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {searchMutation.isPending ? 'Searching...' : 'Search'}
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
            ) : (
              <>
                <span className="font-semibold text-gray-900">
                  {formatCount(countData?.count || 0)}
                </span>
                {' '}verified listings for {filters.mode === 'ai' ? 'AI-matched properties' : `properties for ${filters.mode}`}
                {filters.location && ` in ${filters.location}`}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
