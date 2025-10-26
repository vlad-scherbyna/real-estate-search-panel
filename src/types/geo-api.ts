// location type enum
export enum LocationType {
  RECENT = 'recent',
  POPULAR = 'popular',
}

// Recent search API response item
export interface RecentSearchItem {
  mapboxId: string
  type: 'locality' | 'place'
  name: string
  pt: [number, number] // [lng, lat]
}

// Popular boundary child
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

// suggestion type for UI
export interface LocationSuggestion {
  id: string
  name: string
  type: LocationType
  label?: string // for popular
  location?: [number, number] // [lng, lat] for recent
}
