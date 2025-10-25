'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'

export interface LocationFieldProps {
  className?: string
}

const mockSuggestions = [
  { id: '1', name: 'New York, NY', type: 'city' },
  { id: '2', name: 'Brooklyn, NY', type: 'borough' },
  { id: '3', name: 'Manhattan, NY', type: 'borough' },
  { id: '4', name: 'Queens, NY', type: 'borough' },
  { id: '5', name: 'Los Angeles, CA', type: 'city' },
  { id: '6', name: 'Chicago, IL', type: 'city' },
  { id: '7', name: 'Miami, FL', type: 'city' },
  { id: '8', name: 'San Francisco, CA', type: 'city' },
]

export function LocationField({ className }: LocationFieldProps) {
  const { filters, updateFilter } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(filters.location || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use useMemo to compute suggestions instead of useEffect
  const suggestions = useMemo(() => {
    if (inputValue) {
      return mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    }
    return mockSuggestions
  }, [inputValue])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (location: string) => {
    setInputValue(location)
    updateFilter('location', location)
    setIsOpen(false)
  }

  const handleClear = () => {
    setInputValue('')
    updateFilter('location', undefined)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Where are you looking?"
          className={cn(
            'w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder-gray-400 text-gray-900',
            'transition-all duration-200'
          )}
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion.name)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">{suggestion.name}</div>
                <div className="text-sm text-gray-500 capitalize">{suggestion.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}