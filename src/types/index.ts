export interface SearchFilters {
  mode: 'rent' | 'buy' | 'ai'
  location?: string
  category?: string
  priceRange?: [number, number]
  rooms?: number
  area?: [number, number]
  type?: 'apartment' | 'house' | 'commercial'
}

export interface Listing {
  id: string
  title: string
  price: number
  location: string
  rooms?: number
  area: number
  images: string[]
  coordinates: [number, number]
  type: 'apartment' | 'house' | 'commercial'
  mode: 'rent' | 'buy'
}

export interface PriceHistogramData {
  range: [number, number]
  count: number
}
