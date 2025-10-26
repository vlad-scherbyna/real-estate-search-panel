import axios from 'axios'
import { MapboxSuggestion } from "@/types/mapbox-api";

const MAPBOX_TOKEN = 'pk.eyJ1IjoibHlzdGlvIiwiYSI6ImNtMjA3cmFoejBnMngycXM4anNuNXFmaTQifQ.y-WiEerYZrFOm8Xd8a7GwQ'

// Separate client for Mapbox API
const mapboxClient = axios.create({
  baseURL: 'https://api.mapbox.com',
  timeout: 5000,
})

export const mapboxApi = {
  // Geocoding / Address search
  searchAddresses: async (query: string): Promise<MapboxSuggestion[]> => {
    if (!query || query.length < 2) return []

    const response = await mapboxClient.get('/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json', {
      params: {
        access_token: MAPBOX_TOKEN,
        language: 'de',
        country: 'at',
        types: 'address,district,place,locality,neighborhood,city,street,poi',
        limit: 8,
        autocomplete: true,
      }
    })

    return response.data.features || []
  },
}
