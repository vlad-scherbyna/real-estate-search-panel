'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'

export interface PriceFieldProps {
  className?: string
}

const priceRanges = {
  rent: [
    { id: 'rent-0-1000', label: 'Under $1,000', min: 0, max: 1000 },
    { id: 'rent-1000-2000', label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { id: 'rent-2000-3000', label: '$2,000 - $3,000', min: 2000, max: 3000 },
    { id: 'rent-3000-4000', label: '$3,000 - $4,000', min: 3000, max: 4000 },
    { id: 'rent-4000-5000', label: '$4,000 - $5,000', min: 4000, max: 5000 },
    { id: 'rent-5000+', label: '$5,000+', min: 5000, max: null },
  ],
  buy: [
    { id: 'buy-0-200k', label: 'Under $200K', min: 0, max: 200000 },
    { id: 'buy-200k-400k', label: '$200K - $400K', min: 200000, max: 400000 },
    { id: 'buy-400k-600k', label: '$400K - $600K', min: 400000, max: 600000 },
    { id: 'buy-600k-800k', label: '$600K - $800K', min: 600000, max: 800000 },
    { id: 'buy-800k-1m', label: '$800K - $1M', min: 800000, max: 1000000 },
    { id: 'buy-1m+', label: '$1M+', min: 1000000, max: null },
  ],
}

export function PriceField({ className }: PriceFieldProps) {
  const { filters, updateFilter } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentRanges = priceRanges[filters.mode === 'buy' ? 'buy' : 'rent']
  const selectedRange = currentRanges.find(range => range.id === filters.priceRange)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset price range when mode changes
  useEffect(() => {
    if (filters.priceRange && !currentRanges.find(range => range.id === filters.priceRange)) {
      updateFilter('priceRange', undefined)
    }
  }, [filters.mode, filters.priceRange, currentRanges, updateFilter])

  const handleSelect = (rangeId: string) => {
    updateFilter('priceRange', rangeId)
    setIsOpen(false)
  }

  const getPriceLabel = () => {
    if (filters.mode === 'ai') {
      return 'AI will suggest prices'
    }
    return selectedRange?.label || 'Price range'
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={filters.mode === 'ai'}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'border border-gray-200 rounded-lg bg-white',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'hover:border-gray-300 transition-all duration-200',
          isOpen && 'ring-2 ring-blue-500 border-transparent',
          filters.mode === 'ai' && 'bg-gray-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className={cn(
            selectedRange ? 'text-gray-900' : 'text-gray-400',
            filters.mode === 'ai' && 'text-purple-600'
          )}>
            {getPriceLabel()}
          </span>
        </div>
        {filters.mode !== 'ai' && (
          <svg className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && filters.mode !== 'ai' && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {currentRanges.map((range) => {
            const isSelected = filters.priceRange === range.id
            return (
              <button
                key={range.id}
                onClick={() => handleSelect(range.id)}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                  isSelected && 'bg-blue-50 text-blue-900'
                )}
              >
                <div className="font-medium">{range.label}</div>
                {filters.mode === 'rent' && (
                  <div className="text-sm text-gray-500">per month</div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
