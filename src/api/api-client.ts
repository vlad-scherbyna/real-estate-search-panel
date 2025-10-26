import axios from 'axios'

// Base API client
export const apiClient = axios.create({
  baseURL: 'https://api.lystio.co',
  headers: {
    'Content-Type': 'application/json',
  },
})
