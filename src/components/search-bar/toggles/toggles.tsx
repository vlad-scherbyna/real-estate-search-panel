'use client'

import { useSearchStore } from '@/store/search'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface TogglesProps {
  className?: string
}

const toggleOptions = [
  { value: 'rent' as const, label: 'Rent' },
  { value: 'buy' as const, label: 'Buy' },
  { value: 'ai' as const, label: 'Lystio AI'},
] as const

export function Toggles({ className }: TogglesProps) {
  const { filters, updateFilter } = useSearchStore()

  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative flex bg-gray-100/70 rounded-full p-2">
        {toggleOptions.map((option) => {
          const isActive = filters.mode === option.value
          return (
            <button
              key={option.value}
              onClick={() => updateFilter('mode', option.value)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-w-[80px]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                isActive
                  ? 'text-black z-10'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="toggle-background"
                  className={cn(
                    "absolute inset-0 bg-white rounded-full shadow-sm",
                    option.value === 'ai' && isActive && "bg-gradient-to-r from-white to-white"
                  )}
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className={cn(
                "relative z-10",
                option.value === 'ai' && "text-purple-600 font-semibold"
              )}>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}