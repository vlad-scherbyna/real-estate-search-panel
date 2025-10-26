'use client'

import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'

export interface PriceFieldProps {
  className?: string
}

export function PriceField({ className }: PriceFieldProps) {
  const { filters } = useSearchStore()

  const getPriceHint = () => {
    if (filters.mode === 'rent') {
      return 'e.g. €800 - €1,200/month'
    }
    if (filters.mode === 'buy') {
      return 'e.g. €200K - €500K'
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-sm text-gray-500">
              {getPriceHint()}
            </span>
        </div>
      </div>
    </div>
  )
}