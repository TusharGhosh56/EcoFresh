import { useState, useEffect } from 'react'

// API configuration
const API_KEY = '741081f2196356e85d5138db13c2f41c'
const BASE_URL = 'http://api.openweathermap.org/data/2.5'
const GEO_URL = 'http://api.openweathermap.org/geo/1.0'

// Types
interface CityData {
  name: string
  country: string
  lat: number
  lon: number
  state?: string
}

interface AirPollutionData {
  coord: { lat: number; lon: number }
  list: Array<{
    dt: number
    main: { aqi: number }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

export interface CityAirQuality {
  city: string
  location: string
  aqi: number
  status: string
  color: string
  bgClass: string
  details: {
    pm25: string
    pm10: string
    o3: string
  }
  coordinates: {
    lat: number
    lon: number
  }
}

export interface HistoricalData {
  labels: string[]
  data: number[]
}

// API Functions
const getCityCoordinates = async (cityName: string): Promise<CityData | null> => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.length === 0) {
      console.warn(`No coordinates found for city: ${cityName}`)
      return null
    }
    
    return data[0]
  } catch (error) {
    console.error(`Error fetching coordinates for ${cityName}:`, error)
    return null
  }
}

const getCurrentAirPollution = async (lat: number, lon: number): Promise<AirPollutionData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching current air pollution:', error)
    return null
  }
}

const getHistoricalAirPollution = async (lat: number, lon: number): Promise<AirPollutionData | null> => {
  try {
    const end = Math.floor(Date.now() / 1000)
    const start = end - (24 * 60 * 60)
    
    const response = await fetch(
      `${BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching historical air pollution:', error)
    return null
  }
}

const getAQIStatus = (aqi: number): { status: string, color: string, bgClass: string } => {
  switch (aqi) {
    case 1:
      return { status: 'Excellent', color: '#10b981', bgClass: 'bg-emerald-500/20 text-emerald-400' }
    case 2:
      return { status: 'Good', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' }
    case 3:
      return { status: 'Moderate', color: '#f97316', bgClass: 'bg-orange-500/20 text-orange-400' }
    case 4:
      return { status: 'Poor', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' }
    case 5:
      return { status: 'Very Poor', color: '#dc2626', bgClass: 'bg-red-600/20 text-red-300' }
    default:
      return { status: 'Unknown', color: '#6b7280', bgClass: 'bg-gray-500/20 text-gray-400' }
  }
}

const convertToEPAScale = (aqi: number, pm25: number): number => {
  switch (aqi) {
    case 1: return Math.min(50, Math.max(0, Math.round(pm25 * 2)))
    case 2: return Math.min(100, Math.max(51, Math.round(pm25 * 2.5)))
    case 3: return Math.min(150, Math.max(101, Math.round(pm25 * 3)))
    case 4: return Math.min(200, Math.max(151, Math.round(pm25 * 3.5)))
    case 5: return Math.min(300, Math.max(201, Math.round(pm25 * 4)))
    default: return Math.round(pm25 * 2)
  }
}

const DEFAULT_CITIES = [
  { name: 'New York', fullName: 'New York City', state: 'NY' },
  { name: 'Los Angeles', fullName: 'Los Angeles', state: 'CA' },
  { name: 'Seattle', fullName: 'Seattle', state: 'WA' },
  { name: 'Miami', fullName: 'Miami', state: 'FL' }
]

export const useAirQuality = () => {
  const [cities, setCities] = useState<CityAirQuality[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAirQualityData()
  }, [])

  const fetchAirQualityData = async () => {
    try {
      setLoading(true)
      setError(null)

      const cityPromises = DEFAULT_CITIES.map(async (city) => {
        try {
          const coordinates = await getCityCoordinates(`${city.name}, ${city.state}, US`)
          
          if (!coordinates) {
            console.warn(`Could not find coordinates for ${city.name}`)
            return null
          }

          const pollutionData = await getCurrentAirPollution(coordinates.lat, coordinates.lon)
          
          if (!pollutionData || !pollutionData.list[0]) {
            console.warn(`Could not get pollution data for ${city.name}`)
            return null
          }

          const currentData = pollutionData.list[0]
          const aqiInfo = getAQIStatus(currentData.main.aqi)
          const displayAQI = convertToEPAScale(currentData.main.aqi, currentData.components.pm2_5)

          return {
            city: city.fullName,
            location: `${city.name}, ${city.state}`,
            aqi: displayAQI,
            status: aqiInfo.status,
            color: aqiInfo.color,
            bgClass: aqiInfo.bgClass,
            details: {
              pm25: `${Math.round(currentData.components.pm2_5)} μg/m³`,
              pm10: `${Math.round(currentData.components.pm10)} μg/m³`,
              o3: `${Math.round(currentData.components.o3)} μg/m³`
            },
            coordinates: {
              lat: coordinates.lat,
              lon: coordinates.lon
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error)
          return null
        }
      })

      const results = await Promise.all(cityPromises)
      const validResults = results.filter((result): result is CityAirQuality => result !== null)
      
      setCities(validResults)

      if (validResults.length > 0 && validResults[0]?.coordinates) {
        await fetchHistoricalData(validResults[0].coordinates.lat, validResults[0].coordinates.lon)
      }

    } catch (error) {
      console.error('Error fetching air quality data:', error)
      setError('Failed to load air quality data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistoricalData = async (lat: number, lon: number) => {
    try {
      const historicalPollution = await getHistoricalAirPollution(lat, lon)
      
      if (!historicalPollution) {
        console.warn('Could not fetch historical data')
        return
      }

      const hourlyData = historicalPollution.list
        .slice(-12)
        .map((item) => ({
          hour: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
          }),
          aqi: convertToEPAScale(item.main.aqi, item.components.pm2_5)
        }))

      setHistoricalData({
        labels: hourlyData.map(d => d.hour),
        data: hourlyData.map(d => d.aqi)
      })
    } catch (error) {
      console.error('Error fetching historical data:', error)
    }
  }

  const refreshData = () => {
    fetchAirQualityData()
  }

  return {
    cities,
    historicalData,
    loading,
    error,
    refreshData
  }
} 