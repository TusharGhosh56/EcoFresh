import { useAirQuality } from '../hooks/useAirQuality'

export default function MapSection() {
  const { cities, loading } = useAirQuality()

  const handleMarkerClick = (cityName: string) => {
    alert(`Air Quality info for ${cityName}. In a real app, this would show detailed pollution data.`)
  }

  const getMarkerClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'marker-good'
      case 'moderate':
        return 'marker-moderate'
      case 'poor':
      case 'very poor':
        return 'marker-poor'
      default:
        return 'marker-moderate'
    }
  }

  const getMarkerPosition = (cityName: string) => {
    // Approximate positions for visualization - in a real app, you'd use actual map coordinates
    switch (cityName.toLowerCase()) {
      case 'new york city':
        return { top: '30%', left: '75%' }
      case 'los angeles':
        return { top: '60%', left: '15%' }
      case 'seattle':
        return { top: '20%', left: '20%' }
      case 'miami':
        return { top: '80%', left: '80%' }
      default:
        return { top: '50%', left: '50%' }
    }
  }

  if (loading) {
    return (
      <div className="map-section mb-16">
        <h3 className="chart-title text-2xl font-semibold mb-6 text-white">Air Quality Map</h3>
        <div className="map-container glass-effect rounded-3xl p-8 h-96 relative overflow-hidden animate-pulse">
          <div className="h-full bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="map-section mb-16">
      <h3 className="chart-title text-2xl font-semibold mb-6 text-white">Air Quality Map</h3>
      <div className="map-container glass-effect rounded-3xl p-8 h-96 relative overflow-hidden">
        <div className="map-placeholder h-full flex flex-col items-center justify-center text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">Interactive Air Quality Map</h3>
          <p className="text-white/70 text-lg">Real-time monitoring stations across the US</p>
          <div className="mt-4 text-sm text-white/50">
            Showing {cities.length} cities with live data
          </div>
        </div>
        
        {/* Dynamic location markers based on real data */}
        {cities.map((city, index) => {
          const position = getMarkerPosition(city.city)
          const markerClass = getMarkerClass(city.status)
          
          return (
            <div 
              key={index}
              className={`location-marker ${markerClass} cursor-pointer transform hover:scale-110 transition-transform duration-200`}
              style={position}
              title={`${city.city}: AQI ${city.aqi} (${city.status})`}
              onClick={() => handleMarkerClick(city.city)}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {city.city}: {city.aqi}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 