import { forwardRef } from 'react'
import { LocationSuggestion } from '@/types/geo-api'
import { SuggestionGroup } from '../suggestion-group'

interface SuggestionsDropdownProps {
  isOpen: boolean
  suggestions: LocationSuggestion[]
  groupedSuggestions: {
    recent: LocationSuggestion[]
    popular: LocationSuggestion[]
  }
  isLoading: boolean
  error: Error | null
  query: string
  onSuggestionClick: (suggestion: LocationSuggestion) => void
}

export const SuggestionsDropdown = forwardRef<HTMLDivElement, SuggestionsDropdownProps>(
  ({ isOpen, suggestions, groupedSuggestions, isLoading, error, query, onSuggestionClick }, ref) => {
    if (!isOpen) return null

    return (
      <div
        ref={ref}
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
        ) : suggestions.length === 0 ? (
          <div className="px-3 py-4 text-center text-gray-500">
            {query.length >= 2 ? 'No locations found' : 'Type to search locations...'}
          </div>
        ) : (
          <div>
            <SuggestionGroup
              title="Recent"
              suggestions={groupedSuggestions.recent}
              onSuggestionClick={onSuggestionClick}
            />
            <SuggestionGroup
              title="Popular"
              suggestions={groupedSuggestions.popular}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
        )}
      </div>
    )
  }
)

SuggestionsDropdown.displayName = 'SuggestionsDropdown'