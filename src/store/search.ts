import { create } from 'zustand'
import { SearchFilters } from '@/types'

interface SearchState {
  filters: SearchFilters
  isDirty: boolean
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  resetFilters: () => void
  setFilters: (filters: Partial<SearchFilters>) => void
}

const defaultFilters: SearchFilters = {
  mode: 'rent',
  location: undefined,
  category: undefined,
  priceRange: undefined,
  rooms: undefined,
  area: undefined,
  type: undefined,
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  isDirty: false,

  updateFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
      isDirty: true,
    }))
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      isDirty: false,
    })
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
      isDirty: true,
    }))
  },
}))
