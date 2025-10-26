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
        'bg-gray-50'
      )}>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {getPropertyHint()}
          </span>
        </div>
      </div>
    </div>
  )
}