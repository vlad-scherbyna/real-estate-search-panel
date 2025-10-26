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
        'bg-gray-50'
      )}>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
              {getPriceHint()}
            </span>
        </div>
      </div>
    </div>
  )
}