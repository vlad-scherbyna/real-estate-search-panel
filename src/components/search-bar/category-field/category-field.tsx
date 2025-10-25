'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'

export interface CategoryFieldProps {
  className?: string
}

const categories = [
  { id: 'apartment', name: 'Apartment', icon: '🏠' },
  { id: 'house', name: 'House', icon: '🏡' },
  { id: 'villa', name: 'Villa', icon: '🏰' },
  { id: 'townhouse', name: 'Townhouse', icon: '🏘️' },
  { id: 'condo', name: 'Condo', icon: '🏢' },
  { id: 'loft', name: 'Loft', icon: '🏭' },
  { id: 'studio', name: 'Studio', icon: '🏠' },
  { id: 'commercial', name: 'Commercial', icon: '🏪' },
]

export function CategoryField({ className }: CategoryFieldProps) {
  const { filters, updateFilter } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCategory = categories.find(cat => cat.id === filters.category)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (categoryId: string) => {
    updateFilter('category', categoryId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3',
          'border border-gray-200 rounded-lg bg-white',
          'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'hover:border-gray-300 transition-all duration-200',
          isOpen && 'ring-2 ring-blue-500 border-transparent'
        )}
      >
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
          </svg>
          <span className={cn(
            selectedCategory ? 'text-gray-900' : 'text-gray-400'
          )}>
            {selectedCategory ? (
              <span className="flex items-center gap-2">
                <span>{selectedCategory.icon}</span>
                {selectedCategory.name}
              </span>
            ) : (
              'Property type'
            )}
          </span>
        </div>
        <svg className={cn(
          'h-5 w-5 text-gray-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {categories.map((category) => {
            const isSelected = filters.category === category.id
            return (
              <button
                key={category.id}
                onClick={() => handleSelect(category.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                {isSelected && (
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
