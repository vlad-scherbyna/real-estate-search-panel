'use client'

import { cn } from '@/lib/utils'

interface SearchButtonProps {
  onSearch: () => void
  isLoading: boolean
}

export function SearchButton({ onSearch, isLoading }: SearchButtonProps) {
  return (
    <div className="bg-white p-4 flex items-end">
      <button
        onClick={onSearch}
        disabled={isLoading}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-6 py-3',
          'font-semibold text-white rounded-lg',
          'transition-all duration-200 shadow-md hover:shadow-lg',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500'
        )}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        <span className="hidden sm:inline">
          {isLoading ? 'Searching...' : 'Search'}
        </span>
      </button>
    </div>
  )
}
