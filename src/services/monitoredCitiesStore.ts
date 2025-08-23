import { useState, useEffect } from 'react'

interface CityData {
  name: string
  aqi: number
  status: string
  coords: { lat: number; lng: number }
}

// Shared store for monitored cities data
class MonitoredCitiesStore {
  private static instance: MonitoredCitiesStore
  private citiesData: CityData[] = []
  private listeners: ((cities: CityData[]) => void)[] = []

  static getInstance(): MonitoredCitiesStore {
    if (!MonitoredCitiesStore.instance) {
      MonitoredCitiesStore.instance = new MonitoredCitiesStore()
    }
    return MonitoredCitiesStore.instance
  }

  setCitiesData(cities: CityData[]) {
    this.citiesData = cities
    this.notifyListeners()
  }

  getCitiesData(): CityData[] {
    return this.citiesData
  }

  subscribe(listener: (cities: CityData[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.citiesData))
  }
}

// Hook to use monitored cities data
export function useMonitoredCities() {
  const [citiesData, setCitiesData] = useState<CityData[]>([])
  const store = MonitoredCitiesStore.getInstance()

  useEffect(() => {
    setCitiesData(store.getCitiesData())
    const unsubscribe = store.subscribe(setCitiesData)
    return unsubscribe
  }, [store])

  const updateCitiesData = (cities: CityData[]) => {
    store.setCitiesData(cities)
  }

  return {
    citiesData,
    updateCitiesData
  }
}

export { MonitoredCitiesStore }
export type { CityData }
