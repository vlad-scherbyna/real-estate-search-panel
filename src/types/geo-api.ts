// Recent search API response item
export interface RecentSearchItem {
  mapboxId: string
  type: 'locality' | 'place'
  name: string
  pt: [number, number] // [lng, lat]
}

// Popular boundary child (district)
export interface PopularBoundaryChild {
  name: string
  altName: string
  id: string
  postal_code: string
  urlSegment: string | null
}

// Popular boundary API response item
export interface PopularBoundaryItem {
  name: string
  altName: string
  id: string
  children: PopularBoundaryChild[]
  urlSegment: string
}

// Simplified suggestion type for UI (only 2 categories)
export interface LocationSuggestion {
  id: string
  name: string // для recent - просто name, для popular - altName
  type: 'recent' | 'popular'
  label?: string // для popular - показываем кол-во районов
  location?: [number, number] // [lng, lat] только для recent
}
