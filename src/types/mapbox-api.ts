// Mapbox types
export interface MapboxSuggestion {
  id: string
  place_name: string
  center: [number, number]
  place_type: string[]
  properties: {
    accuracy?: string
  }
}
