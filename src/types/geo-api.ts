// Geo API types
export interface RecentSearch {
  id: string
  query: string
  timestamp: string
  location?: {
    lat: number
    lng: number
  }
}

export interface District {
  id: string
  name: string
  type: 'district' | 'city' | 'neighborhood'
  boundaries?: {
    lat: number
    lng: number
  }[]
}

export interface PopularBoundary {
  id: string
  name: string
  type: string
  center: {
    lat: number
    lng: number
  }
}

// Filter types for API
export interface SearchFilter {
  withinId?: string[]
  type?: number[]
  rentType?: ('rent' | 'buy')[]
  rent?: [number, number]
}

// Histogram types
export interface HistogramBucket {
  min: number
  max: number
  count: number
}

export interface PriceHistogram {
  min: number
  max: number
  buckets: HistogramBucket[]
}

// Count response
export interface TenementCount {
  count: number
}
