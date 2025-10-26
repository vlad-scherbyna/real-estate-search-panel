'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useCombinedLocationSuggestions } from '@/api/geo/geo'
import { LocationSuggestion, LocationType } from '@/types/geo-api'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { SuggestionsDropdown } from "./suggestions-dropdown";

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

  // Get combined suggestions with backend search for popular boundaries
  const { data: allSuggestions, isLoading, error } = useCombinedLocationSuggestions(searchQuery)

  // Filter suggestions based on query (recent searches are filtered on frontend)
  const filteredSuggestions = useMemo(() => {
    if (!allSuggestions) return []

    return allSuggestions.filter(suggestion => {
      if (suggestion.type === LocationType.POPULAR) return true

      if (suggestion.type === LocationType.RECENT) {
        return suggestion.name.toLowerCase().includes(query.toLowerCase())
      }

      return true
    })
  }, [allSuggestions, query])

  // Group suggestions by type
  const groupedSuggestions = useMemo(() => ({
    recent: filteredSuggestions.filter(s => s.type === LocationType.RECENT),
    popular: filteredSuggestions.filter(s => s.type === LocationType.POPULAR),
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
            'w-full px-4 py-3 pr-20 text-sm border border-gray-200 rounded-lg',
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

      <SuggestionsDropdown
        ref={dropdownRef}
        isOpen={isOpen}
        suggestions={filteredSuggestions}
        groupedSuggestions={groupedSuggestions}
        isLoading={isLoading}
        error={error}
        query={query}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  )
}