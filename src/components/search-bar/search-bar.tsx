'use client'

import { Toggles } from './toggles'
import { LocationField } from './location-field'
import { CategoryField } from './category-field'
import { PriceField } from './price-field'
import { cn } from '@/lib/utils'
import { useSearchStore } from '@/store/search'

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { filters } = useSearchStore()

  const handleSearch = () => {
    console.log('Search with filters:', filters)
    // Here you would implement actual search logic
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
              className={cn(
                'w-full flex items-center justify-center gap-2 px-6 py-3',
                'font-semibold text-white rounded-lg',
                'transition-all duration-200 shadow-md hover:shadow-lg',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                filters.mode === 'rent' && 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
                filters.mode === 'buy' && 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500',
                filters.mode === 'ai' && 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500'
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">12,453</span> verified listings for {filters.mode === 'ai' ? 'AI-matched' : filters.mode} properties
          </p>
        </div>
      </div>
    </div>
  )
}
