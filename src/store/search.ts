import { create } from 'zustand'
import { SearchFilters } from "@/types/tenement-api";

interface SearchStore {
  filters: SearchFilters
  isDirty: boolean
  selectedDistrictIds: string[]
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  setSelectedDistrictIds: (ids: string[]) => void
  resetFilters: () => void
}

const defaultFilters: SearchFilters = {
  mode: 'rent',
  location: '',
  category: ''
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: defaultFilters,
  isDirty: false,
  selectedDistrictIds: [],

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

  setSelectedDistrictIds: (ids) =>
    set({ selectedDistrictIds: ids, isDirty: true }),

  resetFilters: () =>
    set({
      filters: defaultFilters,
      selectedDistrictIds: [],
      isDirty: true,
    }),
}))
