'use client'

import { Toggles } from './toggles'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header with toggles */}
      <div className="mb-4">
        <Toggles />
      </div>

      {/* Main search fields will be added here */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border">
        {/* Location Field - placeholder */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-400 text-sm">Location field coming soon...</div>
        </div>

        {/* Category Field - placeholder */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-400 text-sm">Category field coming soon...</div>
        </div>

        {/* Price Field - placeholder */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-400 text-sm">Price field coming soon...</div>
        </div>

        {/* Search Button - placeholder */}
        <div className="lg:w-auto">
          <button className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
