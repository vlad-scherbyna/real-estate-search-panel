import { LocationSuggestion, LocationType } from '@/types/geo-api'

interface SuggestionGroupProps {
  title: string
  suggestions: LocationSuggestion[]
  onSuggestionClick: (suggestion: LocationSuggestion) => void
}

export function SuggestionGroup({ title, suggestions, onSuggestionClick }: SuggestionGroupProps) {
  if (suggestions.length === 0) return null

  const getSuggestionIcon = (suggestion: LocationSuggestion) => {
    switch (suggestion.type) {
      case LocationType.RECENT:
        return (
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case LocationType.POPULAR:
        return (
          <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
    }
  }

  return (
    <div>
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
        {title}
      </div>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => onSuggestionClick(suggestion)}
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
