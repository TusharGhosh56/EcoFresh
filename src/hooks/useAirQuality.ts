import { useState, useEffect } from 'react'

// API configurations
const OPENWEATHER_API_KEY = '741081f2196356e85d5138db13c2f41c'
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0'

// OpenAQ API configuration
const OPENAQ_API_KEY = '7f431ee595f5d727bed0ce6d1fc6d411b651d50ac4883419dcb70768685f03fa'
const OPENAQ_BASE_URL = 'https://api.openaq.org/v3'

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

// OpenAQ API Types
interface OpenAQLocation {
  id: number
  name: string
  coordinates: {
    latitude: number
    longitude: number
  }
  country: string
  city?: string
}

interface OpenAQMeasurement {
  value: number
  unit: string
  parameter: string
  datetime: {
    utc: string
    local: string
  }
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
    console.log('Fetching coordinates for:', cityName)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(
      `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`,
      { signal: controller.signal }
    )
    
    clearTimeout(timeoutId)
    console.log('Coordinates response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Coordinates data:', data)
    
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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
      { signal: controller.signal }
    )
    
    clearTimeout(timeoutId)
    
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
      `${OPENWEATHER_BASE_URL}/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${OPENWEATHER_API_KEY}`
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

// OpenAQ API Functions
const getOpenAQLocations = async (city: string, country: string): Promise<OpenAQLocation[]> => {
  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/locations?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&limit=10`,
      {
        headers: {
          'X-API-Key': OPENAQ_API_KEY
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error(`Error fetching OpenAQ locations for ${city}:`, error)
    return []
  }
}

const getOpenAQMeasurements = async (locationId: number): Promise<OpenAQMeasurement[]> => {
  try {
    const response = await fetch(
      `${OPENAQ_BASE_URL}/measurements?location_id=${locationId}&limit=100&order_by=datetime&sort=desc`,
      {
        headers: {
          'X-API-Key': OPENAQ_API_KEY
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error(`Error fetching OpenAQ measurements for location ${locationId}:`, error)
    return []
  }
}

const processOpenAQData = (measurements: OpenAQMeasurement[]): { pm25: number, pm10: number, o3: number } | null => {
  try {
    const pm25Data = measurements.find(m => m.parameter === 'pm25')
    const pm10Data = measurements.find(m => m.parameter === 'pm10')
    const o3Data = measurements.find(m => m.parameter === 'o3')
    
    return {
      pm25: pm25Data?.value || 0,
      pm10: pm10Data?.value || 0,
      o3: o3Data?.value || 0
    }
  } catch (error) {
    console.error('Error processing OpenAQ data:', error)
    return null
  }
}

// Enhanced function to get data from multiple APIs
const getAirQualityFromMultipleAPIs = async (cityName: string, lat?: number, lon?: number) => {
  const results = {
    openweather: null as any,
    openaq: null as any,
    coordinates: null as { lat: number, lon: number } | null
  }
  
  try {
    // Get coordinates if not provided
    if (!lat || !lon) {
      const coords = await getCityCoordinates(cityName)
      if (coords) {
        results.coordinates = { lat: coords.lat, lon: coords.lon }
        lat = coords.lat
        lon = coords.lon
      }
    } else {
      results.coordinates = { lat, lon }
    }
    
    if (!lat || !lon) {
      console.warn(`No coordinates available for ${cityName}`)
      return results
    }
    
    // Fetch from OpenWeatherMap
    const openWeatherPromise = getCurrentAirPollution(lat, lon).then(data => {
      results.openweather = data
      return data
    }).catch(error => {
      console.error('OpenWeatherMap API failed:', error)
      return null
    })
    
    // Fetch from OpenAQ
    const openAQPromise = (async () => {
      try {
        const cityParts = cityName.split(',')
        const city = cityParts[0].trim()
        const country = cityParts[cityParts.length - 1].trim()
        
        const locations = await getOpenAQLocations(city, country)
        if (locations.length > 0) {
          const measurements = await getOpenAQMeasurements(locations[0].id)
          const processedData = processOpenAQData(measurements)
          results.openaq = { measurements, processed: processedData }
          return processedData
        }
        return null
      } catch (error) {
        console.error('OpenAQ API failed:', error)
        return null
      }
    })()
    
    // Wait for both APIs (but don't fail if one fails)
    await Promise.allSettled([openWeatherPromise, openAQPromise])
    
    return results
  } catch (error) {
    console.error(`Error fetching air quality data for ${cityName}:`, error)
    return results
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

// Comprehensive global cities list - leveraging full API coverage
export const EXPANDED_CITIES = [
  // North America (United States)
  { name: 'New York', fullName: 'New York City', state: 'NY', country: 'US' },
  { name: 'Los Angeles', fullName: 'Los Angeles', state: 'CA', country: 'US' },
  { name: 'Chicago', fullName: 'Chicago', state: 'IL', country: 'US' },
  { name: 'Houston', fullName: 'Houston', state: 'TX', country: 'US' },
  { name: 'Phoenix', fullName: 'Phoenix', state: 'AZ', country: 'US' },
  { name: 'Philadelphia', fullName: 'Philadelphia', state: 'PA', country: 'US' },
  { name: 'San Antonio', fullName: 'San Antonio', state: 'TX', country: 'US' },
  { name: 'San Diego', fullName: 'San Diego', state: 'CA', country: 'US' },
  { name: 'Dallas', fullName: 'Dallas', state: 'TX', country: 'US' },
  { name: 'San Jose', fullName: 'San Jose', state: 'CA', country: 'US' },
  { name: 'Austin', fullName: 'Austin', state: 'TX', country: 'US' },
  { name: 'Jacksonville', fullName: 'Jacksonville', state: 'FL', country: 'US' },
  { name: 'Fort Worth', fullName: 'Fort Worth', state: 'TX', country: 'US' },
  { name: 'Columbus', fullName: 'Columbus', state: 'OH', country: 'US' },
  { name: 'San Francisco', fullName: 'San Francisco', state: 'CA', country: 'US' },
  { name: 'Charlotte', fullName: 'Charlotte', state: 'NC', country: 'US' },
  { name: 'Indianapolis', fullName: 'Indianapolis', state: 'IN', country: 'US' },
  { name: 'Seattle', fullName: 'Seattle', state: 'WA', country: 'US' },
  { name: 'Denver', fullName: 'Denver', state: 'CO', country: 'US' },
  { name: 'Washington', fullName: 'Washington D.C.', state: 'DC', country: 'US' },
  { name: 'Boston', fullName: 'Boston', state: 'MA', country: 'US' },
  { name: 'El Paso', fullName: 'El Paso', state: 'TX', country: 'US' },
  { name: 'Detroit', fullName: 'Detroit', state: 'MI', country: 'US' },
  { name: 'Nashville', fullName: 'Nashville', state: 'TN', country: 'US' },
  { name: 'Portland', fullName: 'Portland', state: 'OR', country: 'US' },
  { name: 'Memphis', fullName: 'Memphis', state: 'TN', country: 'US' },
  { name: 'Oklahoma City', fullName: 'Oklahoma City', state: 'OK', country: 'US' },
  { name: 'Las Vegas', fullName: 'Las Vegas', state: 'NV', country: 'US' },
  { name: 'Louisville', fullName: 'Louisville', state: 'KY', country: 'US' },
  { name: 'Baltimore', fullName: 'Baltimore', state: 'MD', country: 'US' },
  { name: 'Milwaukee', fullName: 'Milwaukee', state: 'WI', country: 'US' },
  { name: 'Albuquerque', fullName: 'Albuquerque', state: 'NM', country: 'US' },
  { name: 'Tucson', fullName: 'Tucson', state: 'AZ', country: 'US' },
  { name: 'Fresno', fullName: 'Fresno', state: 'CA', country: 'US' },
  { name: 'Sacramento', fullName: 'Sacramento', state: 'CA', country: 'US' },
  { name: 'Mesa', fullName: 'Mesa', state: 'AZ', country: 'US' },
  { name: 'Kansas City', fullName: 'Kansas City', state: 'MO', country: 'US' },
  { name: 'Atlanta', fullName: 'Atlanta', state: 'GA', country: 'US' },
  { name: 'Long Beach', fullName: 'Long Beach', state: 'CA', country: 'US' },
  { name: 'Colorado Springs', fullName: 'Colorado Springs', state: 'CO', country: 'US' },
  { name: 'Raleigh', fullName: 'Raleigh', state: 'NC', country: 'US' },
  { name: 'Miami', fullName: 'Miami', state: 'FL', country: 'US' },
  { name: 'Virginia Beach', fullName: 'Virginia Beach', state: 'VA', country: 'US' },
  { name: 'Omaha', fullName: 'Omaha', state: 'NE', country: 'US' },
  { name: 'Oakland', fullName: 'Oakland', state: 'CA', country: 'US' },
  { name: 'Minneapolis', fullName: 'Minneapolis', state: 'MN', country: 'US' },
  { name: 'Tulsa', fullName: 'Tulsa', state: 'OK', country: 'US' },
  { name: 'Arlington', fullName: 'Arlington', state: 'TX', country: 'US' },
  { name: 'New Orleans', fullName: 'New Orleans', state: 'LA', country: 'US' },

  // Canada
  { name: 'Toronto', fullName: 'Toronto', state: 'ON', country: 'CA' },
  { name: 'Montreal', fullName: 'Montreal', state: 'QC', country: 'CA' },
  { name: 'Vancouver', fullName: 'Vancouver', state: 'BC', country: 'CA' },
  { name: 'Calgary', fullName: 'Calgary', state: 'AB', country: 'CA' },
  { name: 'Edmonton', fullName: 'Edmonton', state: 'AB', country: 'CA' },
  { name: 'Ottawa', fullName: 'Ottawa', state: 'ON', country: 'CA' },
  { name: 'Winnipeg', fullName: 'Winnipeg', state: 'MB', country: 'CA' },
  { name: 'Quebec City', fullName: 'Quebec City', state: 'QC', country: 'CA' },
  { name: 'Hamilton', fullName: 'Hamilton', state: 'ON', country: 'CA' },
  { name: 'Kitchener', fullName: 'Kitchener', state: 'ON', country: 'CA' },

  // Mexico
  { name: 'Mexico City', fullName: 'Mexico City', state: '', country: 'MX' },
  { name: 'Guadalajara', fullName: 'Guadalajara', state: '', country: 'MX' },
  { name: 'Monterrey', fullName: 'Monterrey', state: '', country: 'MX' },
  { name: 'Puebla', fullName: 'Puebla', state: '', country: 'MX' },
  { name: 'Tijuana', fullName: 'Tijuana', state: '', country: 'MX' },
  { name: 'León', fullName: 'León', state: '', country: 'MX' },
  { name: 'Juárez', fullName: 'Ciudad Juárez', state: '', country: 'MX' },

  // Europe - United Kingdom
  { name: 'London', fullName: 'London', state: '', country: 'GB' },
  { name: 'Birmingham', fullName: 'Birmingham', state: '', country: 'GB' },
  { name: 'Manchester', fullName: 'Manchester', state: '', country: 'GB' },
  { name: 'Glasgow', fullName: 'Glasgow', state: '', country: 'GB' },
  { name: 'Liverpool', fullName: 'Liverpool', state: '', country: 'GB' },
  { name: 'Leeds', fullName: 'Leeds', state: '', country: 'GB' },
  { name: 'Sheffield', fullName: 'Sheffield', state: '', country: 'GB' },
  { name: 'Edinburgh', fullName: 'Edinburgh', state: '', country: 'GB' },
  { name: 'Bristol', fullName: 'Bristol', state: '', country: 'GB' },
  { name: 'Cardiff', fullName: 'Cardiff', state: '', country: 'GB' },

  // Europe - France
  { name: 'Paris', fullName: 'Paris', state: '', country: 'FR' },
  { name: 'Marseille', fullName: 'Marseille', state: '', country: 'FR' },
  { name: 'Lyon', fullName: 'Lyon', state: '', country: 'FR' },
  { name: 'Toulouse', fullName: 'Toulouse', state: '', country: 'FR' },
  { name: 'Nice', fullName: 'Nice', state: '', country: 'FR' },
  { name: 'Nantes', fullName: 'Nantes', state: '', country: 'FR' },
  { name: 'Strasbourg', fullName: 'Strasbourg', state: '', country: 'FR' },
  { name: 'Montpellier', fullName: 'Montpellier', state: '', country: 'FR' },
  { name: 'Bordeaux', fullName: 'Bordeaux', state: '', country: 'FR' },
  { name: 'Lille', fullName: 'Lille', state: '', country: 'FR' },

  // Europe - Germany
  { name: 'Berlin', fullName: 'Berlin', state: '', country: 'DE' },
  { name: 'Hamburg', fullName: 'Hamburg', state: '', country: 'DE' },
  { name: 'Munich', fullName: 'Munich', state: '', country: 'DE' },
  { name: 'Cologne', fullName: 'Cologne', state: '', country: 'DE' },
  { name: 'Frankfurt', fullName: 'Frankfurt', state: '', country: 'DE' },
  { name: 'Stuttgart', fullName: 'Stuttgart', state: '', country: 'DE' },
  { name: 'Düsseldorf', fullName: 'Düsseldorf', state: '', country: 'DE' },
  { name: 'Dortmund', fullName: 'Dortmund', state: '', country: 'DE' },
  { name: 'Essen', fullName: 'Essen', state: '', country: 'DE' },
  { name: 'Leipzig', fullName: 'Leipzig', state: '', country: 'DE' },

  // Europe - Italy
  { name: 'Rome', fullName: 'Rome', state: '', country: 'IT' },
  { name: 'Milan', fullName: 'Milan', state: '', country: 'IT' },
  { name: 'Naples', fullName: 'Naples', state: '', country: 'IT' },
  { name: 'Turin', fullName: 'Turin', state: '', country: 'IT' },
  { name: 'Palermo', fullName: 'Palermo', state: '', country: 'IT' },
  { name: 'Genoa', fullName: 'Genoa', state: '', country: 'IT' },
  { name: 'Bologna', fullName: 'Bologna', state: '', country: 'IT' },
  { name: 'Florence', fullName: 'Florence', state: '', country: 'IT' },
  { name: 'Bari', fullName: 'Bari', state: '', country: 'IT' },
  { name: 'Catania', fullName: 'Catania', state: '', country: 'IT' },

  // Europe - Spain
  { name: 'Madrid', fullName: 'Madrid', state: '', country: 'ES' },
  { name: 'Barcelona', fullName: 'Barcelona', state: '', country: 'ES' },
  { name: 'Valencia', fullName: 'Valencia', state: '', country: 'ES' },
  { name: 'Seville', fullName: 'Seville', state: '', country: 'ES' },
  { name: 'Zaragoza', fullName: 'Zaragoza', state: '', country: 'ES' },
  { name: 'Málaga', fullName: 'Málaga', state: '', country: 'ES' },
  { name: 'Murcia', fullName: 'Murcia', state: '', country: 'ES' },
  { name: 'Palma', fullName: 'Palma', state: '', country: 'ES' },
  { name: 'Las Palmas', fullName: 'Las Palmas', state: '', country: 'ES' },
  { name: 'Bilbao', fullName: 'Bilbao', state: '', country: 'ES' },

  // Europe - Netherlands
  { name: 'Amsterdam', fullName: 'Amsterdam', state: '', country: 'NL' },
  { name: 'Rotterdam', fullName: 'Rotterdam', state: '', country: 'NL' },
  { name: 'The Hague', fullName: 'The Hague', state: '', country: 'NL' },
  { name: 'Utrecht', fullName: 'Utrecht', state: '', country: 'NL' },
  { name: 'Eindhoven', fullName: 'Eindhoven', state: '', country: 'NL' },

  // Europe - Other
  { name: 'Brussels', fullName: 'Brussels', state: '', country: 'BE' },
  { name: 'Vienna', fullName: 'Vienna', state: '', country: 'AT' },
  { name: 'Zurich', fullName: 'Zurich', state: '', country: 'CH' },
  { name: 'Stockholm', fullName: 'Stockholm', state: '', country: 'SE' },
  { name: 'Copenhagen', fullName: 'Copenhagen', state: '', country: 'DK' },
  { name: 'Oslo', fullName: 'Oslo', state: '', country: 'NO' },
  { name: 'Helsinki', fullName: 'Helsinki', state: '', country: 'FI' },
  { name: 'Dublin', fullName: 'Dublin', state: '', country: 'IE' },
  { name: 'Prague', fullName: 'Prague', state: '', country: 'CZ' },
  { name: 'Warsaw', fullName: 'Warsaw', state: '', country: 'PL' },
  { name: 'Budapest', fullName: 'Budapest', state: '', country: 'HU' },
  { name: 'Lisbon', fullName: 'Lisbon', state: '', country: 'PT' },
  { name: 'Athens', fullName: 'Athens', state: '', country: 'GR' },

  // Asia - China
  { name: 'Beijing', fullName: 'Beijing', state: '', country: 'CN' },
  { name: 'Shanghai', fullName: 'Shanghai', state: '', country: 'CN' },
  { name: 'Guangzhou', fullName: 'Guangzhou', state: '', country: 'CN' },
  { name: 'Shenzhen', fullName: 'Shenzhen', state: '', country: 'CN' },
  { name: 'Chengdu', fullName: 'Chengdu', state: '', country: 'CN' },
  { name: 'Hangzhou', fullName: 'Hangzhou', state: '', country: 'CN' },
  { name: 'Wuhan', fullName: 'Wuhan', state: '', country: 'CN' },
  { name: 'Xi\'an', fullName: 'Xi\'an', state: '', country: 'CN' },
  { name: 'Nanjing', fullName: 'Nanjing', state: '', country: 'CN' },
  { name: 'Chongqing', fullName: 'Chongqing', state: '', country: 'CN' },

  // Asia - India
  { name: 'New Delhi', fullName: 'New Delhi', state: '', country: 'IN' },
  { name: 'Mumbai', fullName: 'Mumbai', state: '', country: 'IN' },
  { name: 'Bangalore', fullName: 'Bangalore', state: '', country: 'IN' },
  { name: 'Hyderabad', fullName: 'Hyderabad', state: '', country: 'IN' },
  { name: 'Chennai', fullName: 'Chennai', state: '', country: 'IN' },
  { name: 'Kolkata', fullName: 'Kolkata', state: '', country: 'IN' },
  { name: 'Pune', fullName: 'Pune', state: '', country: 'IN' },
  { name: 'Ahmedabad', fullName: 'Ahmedabad', state: '', country: 'IN' },
  { name: 'Jaipur', fullName: 'Jaipur', state: '', country: 'IN' },
  { name: 'Surat', fullName: 'Surat', state: '', country: 'IN' },

  // Asia - Japan
  { name: 'Tokyo', fullName: 'Tokyo', state: '', country: 'JP' },
  { name: 'Yokohama', fullName: 'Yokohama', state: '', country: 'JP' },
  { name: 'Osaka', fullName: 'Osaka', state: '', country: 'JP' },
  { name: 'Nagoya', fullName: 'Nagoya', state: '', country: 'JP' },
  { name: 'Sapporo', fullName: 'Sapporo', state: '', country: 'JP' },
  { name: 'Fukuoka', fullName: 'Fukuoka', state: '', country: 'JP' },
  { name: 'Kobe', fullName: 'Kobe', state: '', country: 'JP' },
  { name: 'Kawasaki', fullName: 'Kawasaki', state: '', country: 'JP' },
  { name: 'Kyoto', fullName: 'Kyoto', state: '', country: 'JP' },
  { name: 'Hiroshima', fullName: 'Hiroshima', state: '', country: 'JP' },

  // Asia - South Korea
  { name: 'Seoul', fullName: 'Seoul', state: '', country: 'KR' },
  { name: 'Busan', fullName: 'Busan', state: '', country: 'KR' },
  { name: 'Incheon', fullName: 'Incheon', state: '', country: 'KR' },
  { name: 'Daegu', fullName: 'Daegu', state: '', country: 'KR' },
  { name: 'Daejeon', fullName: 'Daejeon', state: '', country: 'KR' },

  // Asia - Southeast Asia
  { name: 'Bangkok', fullName: 'Bangkok', state: '', country: 'TH' },
  { name: 'Jakarta', fullName: 'Jakarta', state: '', country: 'ID' },
  { name: 'Manila', fullName: 'Manila', state: '', country: 'PH' },
  { name: 'Singapore', fullName: 'Singapore', state: '', country: 'SG' },
  { name: 'Ho Chi Minh City', fullName: 'Ho Chi Minh City', state: '', country: 'VN' },
  { name: 'Kuala Lumpur', fullName: 'Kuala Lumpur', state: '', country: 'MY' },

  // Asia - Middle East
  { name: 'Istanbul', fullName: 'Istanbul', state: '', country: 'TR' },
  { name: 'Dubai', fullName: 'Dubai', state: '', country: 'AE' },
  { name: 'Tehran', fullName: 'Tehran', state: '', country: 'IR' },
  { name: 'Riyadh', fullName: 'Riyadh', state: '', country: 'SA' },
  { name: 'Baghdad', fullName: 'Baghdad', state: '', country: 'IQ' },
  { name: 'Tel Aviv', fullName: 'Tel Aviv', state: '', country: 'IL' },

  // Africa
  { name: 'Cairo', fullName: 'Cairo', state: '', country: 'EG' },
  { name: 'Lagos', fullName: 'Lagos', state: '', country: 'NG' },
  { name: 'Kinshasa', fullName: 'Kinshasa', state: '', country: 'CD' },
  { name: 'Johannesburg', fullName: 'Johannesburg', state: '', country: 'ZA' },
  { name: 'Casablanca', fullName: 'Casablanca', state: '', country: 'MA' },
  { name: 'Addis Ababa', fullName: 'Addis Ababa', state: '', country: 'ET' },
  { name: 'Cape Town', fullName: 'Cape Town', state: '', country: 'ZA' },
  { name: 'Nairobi', fullName: 'Nairobi', state: '', country: 'KE' },
  { name: 'Accra', fullName: 'Accra', state: '', country: 'GH' },
  { name: 'Algiers', fullName: 'Algiers', state: '', country: 'DZ' },

  // South America
  { name: 'São Paulo', fullName: 'São Paulo', state: '', country: 'BR' },
  { name: 'Rio de Janeiro', fullName: 'Rio de Janeiro', state: '', country: 'BR' },
  { name: 'Buenos Aires', fullName: 'Buenos Aires', state: '', country: 'AR' },
  { name: 'Lima', fullName: 'Lima', state: '', country: 'PE' },
  { name: 'Bogotá', fullName: 'Bogotá', state: '', country: 'CO' },
  { name: 'Santiago', fullName: 'Santiago', state: '', country: 'CL' },
  { name: 'Caracas', fullName: 'Caracas', state: '', country: 'VE' },
  { name: 'Brasília', fullName: 'Brasília', state: '', country: 'BR' },
  { name: 'Salvador', fullName: 'Salvador', state: '', country: 'BR' },
  { name: 'Fortaleza', fullName: 'Fortaleza', state: '', country: 'BR' },

  // Oceania
  { name: 'Sydney', fullName: 'Sydney', state: '', country: 'AU' },
  { name: 'Melbourne', fullName: 'Melbourne', state: '', country: 'AU' },
  { name: 'Brisbane', fullName: 'Brisbane', state: '', country: 'AU' },
  { name: 'Perth', fullName: 'Perth', state: '', country: 'AU' },
  { name: 'Adelaide', fullName: 'Adelaide', state: '', country: 'AU' },
  { name: 'Gold Coast', fullName: 'Gold Coast', state: '', country: 'AU' },
  { name: 'Newcastle', fullName: 'Newcastle', state: '', country: 'AU' },
  { name: 'Canberra', fullName: 'Canberra', state: '', country: 'AU' },
  { name: 'Auckland', fullName: 'Auckland', state: '', country: 'NZ' },
  { name: 'Wellington', fullName: 'Wellington', state: '', country: 'NZ' }
]

export const useAirQuality = () => {
  const [cities, setCities] = useState<CityAirQuality[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('useAirQuality useEffect triggered')
    fetchAirQualityData()
  }, [])

  const fetchAirQualityData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting to fetch air quality data for', EXPANDED_CITIES.length, 'cities')
      
      // Start with just 3 cities for testing
      const testCities = [
        { name: 'New York', fullName: 'New York City', state: 'NY', country: 'US' },
        { name: 'Los Angeles', fullName: 'Los Angeles', state: 'CA', country: 'US' },
        { name: 'London', fullName: 'London', state: '', country: 'GB' }
      ]
      console.log('Testing with cities:', testCities)

      const cityPromises = testCities.map(async (city, index) => {
        try {
          console.log(`Processing city ${index + 1}:`, city.name)
          const cityQuery = city.state 
            ? `${city.name}, ${city.state}, ${city.country}` 
            : `${city.name}, ${city.country}`
          
          console.log('City query:', cityQuery)
          
          const multiApiData = await getAirQualityFromMultipleAPIs(cityQuery)
          console.log('Multi API data for', city.name, ':', multiApiData)
          
          if (!multiApiData.coordinates) {
            console.warn(`Could not find coordinates for ${city.name}`)
            return null
          }

          // Use OpenWeatherMap data as primary, OpenAQ as fallback
          let currentData = null
          let displayAQI = 0
          let aqiInfo = { status: 'Unknown', color: '#6b7280', bgClass: 'bg-gray-500/20 text-gray-400' }
          let details = { pm25: 'N/A', pm10: 'N/A', o3: 'N/A' }

          if (multiApiData.openweather?.list?.[0]) {
            // Use OpenWeatherMap data
            currentData = multiApiData.openweather.list[0]
            aqiInfo = getAQIStatus(currentData.main.aqi)
            displayAQI = convertToEPAScale(currentData.main.aqi, currentData.components.pm2_5)
            details = {
              pm25: `${Math.round(currentData.components.pm2_5)} μg/m³`,
              pm10: `${Math.round(currentData.components.pm10)} μg/m³`,
              o3: `${Math.round(currentData.components.o3)} μg/m³`
            }
            console.log('Using OpenWeatherMap data for', city.name, '- AQI:', displayAQI)
          } else if (multiApiData.openaq?.processed) {
            // Fallback to OpenAQ data
            const openaqData = multiApiData.openaq.processed
            const pm25 = openaqData.pm25
            displayAQI = Math.round(pm25 * 2) // Simple conversion
            
            if (displayAQI <= 50) aqiInfo = { status: 'Good', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' }
            else if (displayAQI <= 100) aqiInfo = { status: 'Moderate', color: '#f97316', bgClass: 'bg-orange-500/20 text-orange-400' }
            else if (displayAQI <= 150) aqiInfo = { status: 'Poor', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' }
            else aqiInfo = { status: 'Very Poor', color: '#dc2626', bgClass: 'bg-red-600/20 text-red-300' }
            
            details = {
              pm25: `${Math.round(openaqData.pm25)} μg/m³`,
              pm10: `${Math.round(openaqData.pm10)} μg/m³`,
              o3: `${Math.round(openaqData.o3)} μg/m³`
            }
            console.log('Using OpenAQ data for', city.name, '- AQI:', displayAQI)
          } else {
            console.warn(`No valid data for ${city.name}`)
            return null
          }

          const result = {
            city: city.fullName,
            location: cityQuery,
            aqi: displayAQI,
            status: aqiInfo.status,
            color: aqiInfo.color,
            bgClass: aqiInfo.bgClass,
            details,
            coordinates: multiApiData.coordinates
          }
          
          console.log('Created result for', city.name, ':', result)
          return result
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error)
          return null
        }
      })

      console.log('Waiting for all city promises...')
      const results = await Promise.all(cityPromises)
      const validResults = results.filter((result): result is CityAirQuality => result !== null)
      
      console.log('Fetched data for', validResults.length, 'cities successfully:', validResults)
      setCities(validResults)

      if (validResults.length > 0 && validResults[0]?.coordinates) {
        await fetchHistoricalData(validResults[0].coordinates.lat, validResults[0].coordinates.lon)
      }

    } catch (error) {
      console.error('Error fetching air quality data:', error)
      setError('Failed to load air quality data. Please try again later.')
    } finally {
      console.log('Finished fetching air quality data, setting loading to false')
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