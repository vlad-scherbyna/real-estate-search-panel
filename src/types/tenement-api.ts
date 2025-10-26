// UI types for internal state
export interface SearchFilters {
  mode: 'rent' | 'buy' | 'ai'
  location?: string
  category?: string
  priceRange?: [number, number]
}


// Search Filter - упрощенная версия для нашего MVP
export interface SearchFilter {
  withinId?: string[]  // Array with IDs of selected districts
  type?: number[]      // Array with ID of selected type
  rentType?: ('rent' | 'buy')[]  // Array with rent or buy
  rent?: [number, number]        // Array with min and max rent
  search?: string      // Search term
  status?: 'active'    // Property status
}

// Search Request - полная структура как в API
export interface SearchRequest {
  filter: {
    ids?: number[]
    size?: [number, number]
    rent?: [number, number]
    rentScope?: 'rent'
    rentUtilities?: [number, number]
    rooms?: [number, number]
    roomsBed?: [number, number]
    roomsBath?: [number, number]
    type?: number[]
    subType?: number[]
    condition?: number[]
    accessibility?: number[]
    rentType?: ('rent' | 'buy')[]
    floorType?: number[]
    heatingType?: number[]
    pets?: string[]
    readiness?: number[]
    tier?: number[]
    furnish?: number[]
    status?: 'active'
    locationAccuracy?: 'active'
    search?: string
    rentDurationMax?: number
    hasRequests?: boolean
    hasRequestsUserId?: string
    tags?: string[]
    availableNow?: boolean
    within?: null
    withinId?: string[]
    bbox?: null
    near?: null
    amenities?: null
    moveIn?: string
    maxAge?: number
    efficiencyIncludeNull?: boolean
    minGarages?: boolean
    efficiency?: number
    listId?: number
    searchAgentId?: number
    withLeads?: boolean
    listingDuration?: number
    parking?: [number, number]
    cellar?: [number, number]
    style?: 'old'
    showPriceOnRequest?: boolean
  }
  sort?: {
    rent?: 'asc' | 'desc' | null
    rentPer?: 'asc' | 'desc' | null
    distance?: 'asc' | 'desc' | null
    size?: 'asc' | 'desc' | null
    rooms?: 'asc' | 'desc' | null
    createdAt?: 'asc' | 'desc' | null
    countLeads?: 'asc' | 'desc' | null
  }
  paging?: {
    pageSize: number
    page: number
  }
}

// Property/Tenement types
export interface Property {
  id: number
  title: string
  address: string
  zip: string
  city: string
  country: string
  rooms: number
  roomsBed: number
  roomsBath: number
  size: number
  rent: number
  rentUtilities: number
  rentFull: number
  location: [number, number] // [lat, lng]
  locationIsExact: boolean
  createdAt: string
  updatedAt: string
  type: number
  subType: number
  rentType: 'rent' | 'buy'
  active: boolean
  verified: boolean
  media: MediaItem[]
  details: {
    description?: string
    aiSummary?: string
    additionalInfo?: string
  }
  pricing: PropertyPricing
  amenities: number[]
  tags: string[]
}

export interface MediaItem {
  id: number
  type: string
  cdnUrl: string
  cdnUrlPreview: string
  title?: string
  description?: string
  isTitle: boolean
}

export interface PropertyPricing {
  rent: {
    net: number
    gross: number
    text?: string
  }
  utilities: {
    net: number
    gross: number
  }
  deposit: {
    price: number
    text?: string
  }
  comission: {
    price: number
    text?: string
  }
}

// Search Response
export interface SearchResponse {
  res: Property[]
  paging: {
    pageSize: number
    page: number
  }
}

// Count response
export interface TenementCount {
  count: number
}

// Existing types...
export interface RecentSearch {
  id: string
  query: string
  timestamp: string
  location?: {
    lat: number
    lng: number
  }
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

export interface PropertyCategory {
  id: number
  name: string
  icon: string
}

export interface MapboxSuggestion {
  id: string
  place_name: string
  center: [number, number]
  place_type: string[]
  properties: {
    accuracy?: string
  }
}
