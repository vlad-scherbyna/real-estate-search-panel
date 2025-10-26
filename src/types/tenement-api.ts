export interface SearchFilter {
  withinId?: string[]  // Array with IDs of selected districts
  type?: number[]      // Array with ID of selected type
  rentType?: ('rent' | 'buy')[]  // Array with rent or buy
  rent?: [number, number] // Array with min and max rent
  search?: string      // Search term
  status?: 'active'    // Property status
  locationAccuracy?: (9 | 5 | 1 | 0)[] // Required location accuracy values
}

export interface SearchFilters {
  mode: 'rent' | 'buy' | 'ai'
  location: string
  category: string
  priceRange?: [number, number]
}

// Full API request structure
export interface SearchRequest {
  filter: {
    status: 'active'
    locationAccuracy: 'active' | (9 | 5 | 1 | 0)[]
    withinId?: string[]
    type?: number[]
    rentType?: ('rent' | 'buy')[]
    rent?: [number, number]
    search?: string
  }
  sort: {
    createdAt?: 'asc' | 'desc'
    price?: 'asc' | 'desc'
    [key: string]: 'asc' | 'desc' | undefined
  }
  paging: {
    page: number
    pageSize: number
  }
}

export interface SearchResponse {
  res: TenementItem[]
  paging: {
    pageCount: number
    totalCount: number
    allTotalCount: number
    page: number
  }
}

export interface TenementItem {
  id: string
  title: string
  price: number
  location: {
    lat: number
    lng: number
  }
}
