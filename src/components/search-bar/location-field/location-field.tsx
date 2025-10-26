'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'
import { useMapboxSearch } from "@/api/mapbox";
import { usePopularBoundaries, useRecentSearches } from "@/api/geo/geo";

export interface LocationFieldProps {
  className?: string
}

export function LocationField({ className }: LocationFieldProps) {
  const { filters, updateFilter } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(filters.location || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // API calls
  const { data: mapboxSuggestions = [], isLoading: isSearching } = useMapboxSearch(inputValue)
  const { data: recentSearches = [] } = useRecentSearches()
  const { data: popularBoundaries = [] } = usePopularBoundaries()

  // Combine suggestions based on input
  const suggestions = useMemo(() => {
    if (inputValue.length >= 2) {
      // Show Mapbox results when user is typing
      return mapboxSuggestions.map(suggestion => ({
        id: suggestion.id,
        name: suggestion.place_name,
        type: 'mapbox' as const,
        data: suggestion,
      }))
    } else {
      // Show recent searches and popular locations when input is empty
      const recent = recentSearches.slice(0, 3).map(search => ({
        id: search.id,
        name: search.query,
        type: 'recent' as const,
        data: search,
      }))

      const popular = popularBoundaries.slice(0, 5).map(boundary => ({
        id: boundary.id,
        name: boundary.name,
        type: 'popular' as const,
        data: boundary,
      }))

      return [...recent, ...popular]
    }
  }, [inputValue, mapboxSuggestions, recentSearches, popularBoundaries])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (suggestion: typeof suggestions[0]) => {
    setInputValue(suggestion.name)
    updateFilter('location', suggestion.name)
    setIsOpen(false)
  }

  const handleClear = () => {
    setInputValue('')
    updateFilter('location', undefined)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return '🕒'
      case 'popular':
        return '⭐'
      default:
        return '📍'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent'
      case 'popular':
        return 'Popular'
      default:
        return 'Location'
    }
  }

  // console.log(suggestions)

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Where are you looking?"
          className={cn(
            'w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder-gray-400 text-gray-900',
            'transition-all duration-200'
          )}
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading indicator */}
        {isSearching && inputValue.length >= 2 && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {inputValue.length < 2 && (
            <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
              {recentSearches.length > 0 ? 'Recent & Popular' : 'Popular Locations'}
            </div>
          )}

          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <span className="text-sm">{getTypeIcon(suggestion.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                <div className="text-sm text-gray-500">{getTypeLabel(suggestion.type)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}