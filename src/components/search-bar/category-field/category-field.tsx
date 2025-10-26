
'use client'

import { cn } from '@/lib/utils'
import { useSearchStore } from '@/store/search'

export interface CategoryFieldProps {
  className?: string
}

export function CategoryField({ className }: CategoryFieldProps) {
  const { filters } = useSearchStore()

  const getPropertyHint = () => {
    if (filters.mode === 'rent') {
      return 'e.g. Apartment, House'
    }
    if (filters.mode === 'buy') {
      return 'e.g. House, Condo'
    }
    return 'Coming soon'
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'w-full flex items-center justify-between px-4 py-3',
        'border border-gray-200 rounded-lg bg-white',
        'transition-all duration-200',
        filters.mode === 'ai' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50'
      )}>
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
          </svg>
          <span className="text-sm text-gray-500">
            {getPropertyHint()}
          </span>
        </div>
      </div>
    </div>
  )
}