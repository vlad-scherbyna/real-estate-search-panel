'use client'

import { Toggles } from './toggles'
import { SearchFields } from './search-fields'
import { SearchResultsInfo } from './search-results-info'
import { cn } from '@/lib/utils'
import { useSearch } from "@/hooks/use-search";

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { searchResults, isLoading, handleSearch } = useSearch()

  return (
    <div className={cn('w-full max-w-6xl mx-auto mt-10', className)}>
      <div className="mb-6">
        <Toggles />
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <SearchFields onSearch={handleSearch} isLoading={isLoading} />
        <SearchResultsInfo searchResults={searchResults} />
      </div>
    </div>
  )
}
