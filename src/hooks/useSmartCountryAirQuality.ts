import { useState, useEffect, useCallback } from 'react'
import type { CityAirQuality } from './useAirQuality'
import { getAirQualityFromMultipleAPIs, getAQIStatus, convertToEPAScale, EXPANDED_CITIES } from './useAirQuality'
import PriorityManager from '../services/priorityManager'

interface SmartCountryAirQualityState {
  countries: {
    [countryName: string]: {
      cities: CityAirQuality[]
      loading: boolean
      loaded: boolean
      error?: string
    }
  }
  loading: boolean
  error: string | null
  loadingProgress: {
    loadedCountries: number
    totalCountries: number
    currentCountry: string
    currentCity: string
  }
}

// Country mapping from EXPANDED_CITIES
const COUNTRY_NAMES: { [key: string]: string } = {
  'US': 'United States',
  'CA': 'Canada', 
  'GB': 'United Kingdom',
  'FR': 'France',
  'DE': 'Germany',
  'JP': 'Japan',
  'AU': 'Australia',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'AT': 'Austria',
  'CH': 'Switzerland',
  'SE': 'Sweden',
  'DK': 'Denmark',
  'NO': 'Norway',
  'FI': 'Finland',
  'IE': 'Ireland',
  'CZ': 'Czech Republic',
  'PL': 'Poland',
  'HU': 'Hungary',
  'PT': 'Portugal',
  'GR': 'Greece',
  'CN': 'China',
  'IN': 'India',
  'KR': 'South Korea',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'SG': 'Singapore',
  'VN': 'Vietnam',
  'MY': 'Malaysia',
  'TR': 'Turkey',
  'AE': 'United Arab Emirates',
  'IR': 'Iran',
  'SA': 'Saudi Arabia',
  'IQ': 'Iraq',
  'IL': 'Israel',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'CD': 'Democratic Republic of Congo',
  'ZA': 'South Africa',
  'MA': 'Morocco',
  'ET': 'Ethiopia',
  'KE': 'Kenya',
  'GH': 'Ghana',
  'DZ': 'Algeria',
  'BR': 'Brazil',
  'AR': 'Argentina',
  'PE': 'Peru',
  'CO': 'Colombia',
  'CL': 'Chile',
  'VE': 'Venezuela',
  'MX': 'Mexico',
  'NZ': 'New Zealand'
}

export const useSmartCountryAirQuality = () => {
  const [state, setState] = useState<SmartCountryAirQualityState>({
    countries: {},
    loading: true,
    error: null,
    loadingProgress: {
      loadedCountries: 0,
      totalCountries: 0,
      currentCountry: 'Initializing...',
      currentCity: ''
    }
  })

  const priorityManager = PriorityManager.getInstance()

  // Function to fetch all cities for a country
  const fetchCountryData = useCallback(async (countryName: string): Promise<CityAirQuality[]> => {
    // Check cache first
    const cachedData = priorityManager.getCountryCache(countryName)
    if (cachedData) {
      console.log(`Using cached data for ${countryName}`)
      return cachedData
    }

    try {
      // Get all cities for this country
      const countryCities = EXPANDED_CITIES.filter(city => {
        const displayName = COUNTRY_NAMES[city.country] || city.country
        return displayName === countryName
      })

      console.log(`Fetching data for ${countryCities.length} cities in ${countryName}`)

      const results: CityAirQuality[] = []

      // Fetch data for all cities in the country
      for (let i = 0; i < countryCities.length; i++) {
        const city = countryCities[i]
        
        setState(prev => ({
          ...prev,
          loadingProgress: {
            ...prev.loadingProgress,
            currentCity: `Loading ${city.name}...`
          }
        }))

        try {
          const cityQuery = city.state 
            ? `${city.name}, ${city.state}, ${city.country}` 
            : `${city.name}, ${city.country}`
          
          const multiApiData = await getAirQualityFromMultipleAPIs(cityQuery)
          
          if (!multiApiData.coordinates) {
            console.warn(`Could not find coordinates for ${city.name}`)
            continue
          }

          // Use OpenWeatherMap data as primary, OpenAQ as fallback
          let displayAQI = 0
          let aqiInfo = { status: 'Unknown', color: '#6b7280', bgClass: 'bg-gray-500/20 text-gray-400' }
          let details = { pm25: 'N/A', pm10: 'N/A', o3: 'N/A' }

          if (multiApiData.openweather?.list?.[0]) {
            const currentData = multiApiData.openweather.list[0]
            aqiInfo = getAQIStatus(currentData.main.aqi)
            displayAQI = convertToEPAScale(currentData.main.aqi, currentData.components.pm2_5)
            details = {
              pm25: `${Math.round(currentData.components.pm2_5)} μg/m³`,
              pm10: `${Math.round(currentData.components.pm10)} μg/m³`,
              o3: `${Math.round(currentData.components.o3)} μg/m³`
            }
          } else if (multiApiData.openaq?.processed) {
            const openaqData = multiApiData.openaq.processed
            const pm25 = openaqData.pm25
            displayAQI = Math.round(pm25 * 2)
            
            if (displayAQI <= 50) aqiInfo = { status: 'Good', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' }
            else if (displayAQI <= 100) aqiInfo = { status: 'Moderate', color: '#f97316', bgClass: 'bg-orange-500/20 text-orange-400' }
            else if (displayAQI <= 150) aqiInfo = { status: 'Poor', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' }
            else aqiInfo = { status: 'Very Poor', color: '#dc2626', bgClass: 'bg-red-600/20 text-red-300' }
            
            details = {
              pm25: `${Math.round(openaqData.pm25)} μg/m³`,
              pm10: `${Math.round(openaqData.pm10)} μg/m³`,
              o3: `${Math.round(openaqData.o3)} μg/m³`
            }
          } else {
            continue
          }

          const result: CityAirQuality = {
            city: city.fullName,
            location: cityQuery,
            aqi: displayAQI,
            status: aqiInfo.status,
            color: aqiInfo.color,
            bgClass: aqiInfo.bgClass,
            details,
            coordinates: multiApiData.coordinates
          }

          results.push(result)
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.error(`Error fetching data for ${city.name}:`, error)
          continue
        }
      }

      // Cache the results
      if (results.length > 0) {
        priorityManager.setCountryCache(countryName, results)
      }
      
      return results
    } catch (error) {
      console.error(`Error fetching data for ${countryName}:`, error)
      return []
    }
  }, [priorityManager])

  // Function to load priority countries
  const loadPriorityCountries = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      loadingProgress: { 
        loadedCountries: 0,
        totalCountries: 0,
        currentCountry: 'Initializing priority countries...',
        currentCity: ''
      }
    }))

    // Get high priority countries
    const priorityCountries = priorityManager.getHighPriorityCountries(3) // Start with top 3
    
    setState(prev => ({
      ...prev,
      loadingProgress: {
        ...prev.loadingProgress,
        totalCountries: priorityCountries.length,
        currentCountry: 'Loading priority countries...'
      }
    }))

    console.log('Loading priority countries:', priorityCountries)

    // Load priority countries
    for (let i = 0; i < priorityCountries.length; i++) {
      const countryName = priorityCountries[i]
      
      setState(prev => ({
        ...prev,
        loadingProgress: {
          ...prev.loadingProgress,
          loadedCountries: i,
          currentCountry: `Loading ${countryName}...`,
          currentCity: ''
        },
        countries: {
          ...prev.countries,
          [countryName]: {
            cities: [],
            loading: true,
            loaded: false
          }
        }
      }))

      const countryData = await fetchCountryData(countryName)
      
      setState(prev => ({
        ...prev,
        countries: {
          ...prev.countries,
          [countryName]: {
            cities: countryData,
            loading: false,
            loaded: true
          }
        }
      }))

      // Track that this country was accessed
      priorityManager.trackCountrySelection(countryName)
    }

    setState(prev => ({
      ...prev,
      loading: false,
      loadingProgress: {
        ...prev.loadingProgress,
        loadedCountries: priorityCountries.length,
        currentCountry: 'Priority countries loaded',
        currentCity: ''
      }
    }))

    console.log(`Loaded ${priorityCountries.length} priority countries`)
  }, [fetchCountryData, priorityManager])

  // Function to load a specific country on demand
  const loadCountryOnDemand = useCallback(async (countryName: string): Promise<CityAirQuality[]> => {
    // Check if already loaded
    const existing = state.countries[countryName]
    if (existing && existing.loaded) {
      return existing.cities
    }

    // Track country selection
    priorityManager.trackCountrySelection(countryName)

    // Check cache
    const cached = priorityManager.getCountryCache(countryName)
    if (cached) {
      setState(prev => ({
        ...prev,
        countries: {
          ...prev.countries,
          [countryName]: {
            cities: cached,
            loading: false,
            loaded: true
          }
        }
      }))
      return cached
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      countries: {
        ...prev.countries,
        [countryName]: {
          cities: [],
          loading: true,
          loaded: false
        }
      }
    }))

    // Fetch new data
    const countryData = await fetchCountryData(countryName)
    
    setState(prev => ({
      ...prev,
      countries: {
        ...prev.countries,
        [countryName]: {
          cities: countryData,
          loading: false,
          loaded: true
        }
      }
    }))

    return countryData
  }, [state.countries, fetchCountryData, priorityManager])

  // Get all loaded cities (for compatibility with existing dashboard)
  const getAllLoadedCities = useCallback((): CityAirQuality[] => {
    const allCities: CityAirQuality[] = []
    Object.values(state.countries).forEach(country => {
      if (country.loaded) {
        allCities.push(...country.cities)
      }
    })
    return allCities
  }, [state.countries])

  // Initialize on mount
  useEffect(() => {
    loadPriorityCountries()
    
    // Cleanup old cache entries
    priorityManager.cleanupCache()
  }, [loadPriorityCountries, priorityManager])

  return {
    ...state,
    loadCountryOnDemand,
    refreshPriorityData: loadPriorityCountries,
    getAllLoadedCities,
    trackCountrySelection: priorityManager.trackCountrySelection.bind(priorityManager),
    getPreferences: priorityManager.getPreferences.bind(priorityManager)
  }
}
