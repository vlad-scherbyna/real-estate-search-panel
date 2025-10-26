'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useCombinedLocationSuggestions } from '@/api/geo/geo'
import { LocationSuggestion } from '@/types/geo-api'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

export interface LocationFieldProps {
  className?: string
}

export function LocationField({ className }: LocationFieldProps) {
  const { filters, updateFilter, setSelectedDistrictIds } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)

  const [query, setQuery] = useState(filters.location || '')

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Keep local query in sync with filters.location when it changes externally (URL sync)
  const displayValue = filters.location || ''

  // Update local query if it's different from filter (URL sync case)
  if (query !== displayValue && !isOpen) {
    setQuery(displayValue)
  }

  const debouncedQuery = useDebounce(query, 300)
  const searchQuery = debouncedQuery.length >= 2 ? debouncedQuery : undefined

  const { data: allSuggestions, isLoading, error } = useCombinedLocationSuggestions(searchQuery)

  // Filter suggestions based on query (recent searches are filtered on frontend)
  const filteredSuggestions = useMemo(() => {
    if (!allSuggestions) return []

    return allSuggestions.filter(suggestion => {
      // For popular boundaries, backend already filtered them
      if (suggestion.type === 'popular') return true

      // For recent searches, filter on frontend
      if (suggestion.type === 'recent') {
        return suggestion.name.toLowerCase().includes(query.toLowerCase())
      }

      return true
    })
  }, [allSuggestions, query])

  // Group suggestions by type
  const groupedSuggestions = useMemo(() => ({
    recent: filteredSuggestions.filter(s => s.type === 'recent'),
    popular: filteredSuggestions.filter(s => s.type === 'popular'),
  }), [filteredSuggestions])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setQuery(value)
    updateFilter('location', value)
    setIsOpen(true)
  }

  const handleClear = () => {
    setQuery('')
    updateFilter('location', '')
    setSelectedDistrictIds([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.name)
    updateFilter('location', suggestion.name)

    // Set district IDs based on selection
    if (suggestion.type === 'popular') {
      setSelectedDistrictIds([suggestion.id])
    } else {
      setSelectedDistrictIds([])
    }

    setIsOpen(false)
    inputRef.current?.blur()
  }

  const getSuggestionIcon = (suggestion: LocationSuggestion) => {
    switch (suggestion.type) {
      case 'recent':
        return (
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'popular':
        return (
          <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
    }
  }

  const renderSuggestionGroup = (title: string, suggestions: LocationSuggestion[]) => {
    if (suggestions.length === 0) return null

    return (
      <div key={title}>
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
          {title}
        </div>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
          >
            {getSuggestionIcon(suggestion)}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
              {suggestion.label && (
                <div className="text-sm text-gray-500 truncate">{suggestion.label}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="City District, Street, Postcode"
          className={cn(
            'w-full px-4 py-2 pr-20 text-sm border border-gray-200 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder-gray-500'
          )}
        />

        {/* Right side icons container */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* Clear button - only show when there's text */}
          {query && (
            <button
              onClick={handleClear}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              type="button"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto"
        >
          {isLoading ? (
            <div className="px-3 py-4 text-center text-gray-500">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                Searching...
              </div>
            </div>
          ) : error ? (
            <div className="px-3 py-4 text-center text-red-500">
              Failed to load suggestions
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="px-3 py-4 text-center text-gray-500">
              {query.length >= 2 ? 'No locations found' : 'Type to search locations...'}
            </div>
          ) : (
            <div>
              {renderSuggestionGroup('Recent', groupedSuggestions.recent)}
              {renderSuggestionGroup('Popular', groupedSuggestions.popular)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}