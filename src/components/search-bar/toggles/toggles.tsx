
'use client'

import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { SearchMode } from "@/types/tenement-api";

export interface TogglesProps {
  className?: string
}

const toggleOptions = [
  { value: SearchMode.RENT, label: 'Rent' },
  { value: SearchMode.BUY, label: 'Buy' },
  {
    value: SearchMode.AI,
    label: (
      <>
        Lystio&nbsp;<span className="text-purple-700">AI</span>
      </>
    )
  },
]

export function Toggles({ className }: TogglesProps) {
  const { filters, updateFilter } = useSearchStore()

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative flex bg-gray-100 rounded-full p-1 gap-1 border border-purple-200">
        {toggleOptions.map((option) => {
          const isActive = filters.mode === option.value
          return (
            <button
              key={option.value}
              onClick={() => updateFilter('mode', option.value)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                isActive
                  ? 'text-dark z-10'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="toggle-background"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10 flex justify-center">
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}