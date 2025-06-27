import { useAirQuality } from '../hooks/useAirQuality'

export default function AlertsSection() {
  const { cities, loading } = useAirQuality()

  // Generate alerts based on real air quality data
  const getAlertsFromData = () => {
    if (cities.length === 0) {
      return [
        {
          icon: "📡",
          title: "Loading Air Quality Data",
          location: "Multiple locations",
          time: "Just now",
          severity: "info"
        }
      ]
    }

    const alerts = []

    // Check for poor air quality
    cities.forEach(city => {
      if (city.status === 'Poor' || city.status === 'Very Poor') {
        alerts.push({
          icon: "⚠",
          title: `High Pollution Alert`,
          location: city.location,
          time: "Real-time",
          severity: "danger"
        })
      } else if (city.status === 'Moderate') {
        alerts.push({
          icon: "🔶",
          title: `Moderate Air Quality`,
          location: city.location,
          time: "Real-time",
          severity: "warning"
        })
      }
    })

    // Add general alerts if we have good air quality everywhere
    if (alerts.length === 0) {
      alerts.push({
        icon: "✅",
        title: "Air Quality Good",
        location: "All monitored cities",
        time: "Real-time",
        severity: "info"
      })
    }

    // Add API status alert
    alerts.push({
      icon: "🔄",
      title: "Live Data Active",
      location: "OpenWeatherMap API",
      time: "Connected",
      severity: "info"
    })

    return alerts.slice(0, 3) // Limit to 3 alerts
  }

  const alerts = getAlertsFromData()

  if (loading) {
    return (
      <div className="alerts-section">
        <h3 className="chart-title text-2xl font-semibold mb-6 text-white">Recent Alerts</h3>
        <div className="alerts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="alert-card glass-effect rounded-3xl p-6 animate-pulse">
              <div className="alert-header flex items-center gap-4 mb-4">
                <div className="w-6 h-6 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded flex-1"></div>
              </div>
              <div className="h-3 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="alerts-section">
      <h3 className="chart-title text-2xl font-semibold mb-6 text-white">Live Alerts</h3>
      <div className="alerts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-card glass-effect rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="alert-header flex items-center gap-4 mb-4">
              <div className="alert-icon text-2xl">{alert.icon}</div>
              <div className="alert-title text-lg font-semibold text-white">{alert.title}</div>
            </div>
            <div className="alert-location text-white/70 mb-2">{alert.location}</div>
            <div className="alert-time text-white/50 text-sm">{alert.time}</div>
            <div className={`alert-severity mt-3 px-3 py-1 rounded-full text-xs font-semibold inline-block ${
              alert.severity === 'warning' ? 'bg-orange-500/20 text-orange-400' :
              alert.severity === 'danger' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {alert.severity.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 