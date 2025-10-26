import { SearchResponse } from '@/types/tenement-api'

interface SearchResultsInfoProps {
  searchResults?: SearchResponse
}

export function SearchResultsInfo({ searchResults }: SearchResultsInfoProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toLocaleString()
  }

  if (!searchResults?.paging) {
    return null
  }

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">
              {formatCount(searchResults.paging.totalCount)} found
            </span>
          </div>

          <div className="text-gray-500">
            Page {searchResults.paging.page} of {searchResults.paging.pageCount}
          </div>

          {searchResults.paging.allTotalCount > searchResults.paging.totalCount && (
            <div className="text-gray-500 text-xs">
              ({formatCount(searchResults.paging.allTotalCount)} total available)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
