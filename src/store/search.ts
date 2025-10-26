import { create } from 'zustand'
import { SearchFilters } from '@/types'

interface SearchStore {
  filters: SearchFilters
  isDirty: boolean
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
}

const defaultFilters: SearchFilters = {
  mode: 'rent',
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: defaultFilters,
  isDirty: false,
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      isDirty: true,
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      isDirty: true,
    })),
  resetFilters: () =>
    set({
      filters: defaultFilters,
      isDirty: true,
    }),
}))
