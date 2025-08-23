import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import Navbar from './Navbar'
import Footer from './Footer'
import { getUserPinnedCities, getUserMonitoringStats, removeCityFromPinned, debugUserData } from '../services/firebase'
import { useMonitoredCities } from '../services/monitoredCitiesStore'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

interface ProfileProps {
  userData?: UserData | null
  onLogout?: () => void
}

export default function Profile({ userData, onLogout }: ProfileProps) {
  const [pinnedCities, setPinnedCities] = useState<string[]>([])
  const [frequentCities, setFrequentCities] = useState<{ name: string, count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get monitored cities data from shared store (from Dashboard)
  const { citiesData: monitoredCitiesData } = useMonitoredCities()

  // Filter monitored cities to show only pinned ones
  const pinnedCitiesData = monitoredCitiesData.filter(city => 
    pinnedCities.includes(city.name)
  )

  // Debug logging
  console.log('Profile - Pinned cities names:', pinnedCities)
  console.log('Profile - All monitored cities data:', monitoredCitiesData)
  console.log('Profile - Filtered pinned cities data:', pinnedCitiesData)

  // Load user data from Firebase
  useEffect(() => {
    const loadUserData = async () => {
      if (!userData?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Debug: Check complete user data structure
        await debugUserData(userData.id)
        
        const [pinnedCitiesData, monitoringStatsData] = await Promise.all([
          getUserPinnedCities(userData.id),
          getUserMonitoringStats(userData.id)
        ])
        
        console.log('Loaded pinned cities:', pinnedCitiesData)
        console.log('Loaded monitoring stats:', monitoringStatsData)
        
        setPinnedCities(pinnedCitiesData)
        setFrequentCities(monitoringStatsData.sort((a, b) => b.count - a.count).slice(0, 10)) // Top 10 most frequent
        setError(null)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userData?.id])

  // Initialize animations
  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.fromTo('.profile-hero', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    )
    .fromTo('.profile-content',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
  }, [])

  // Handle unpin city
  const handleUnpinCity = async (cityName: string) => {
    if (!userData?.id) return

    try {
      const updatedPinnedCities = await removeCityFromPinned(userData.id, cityName)
      setPinnedCities(updatedPinnedCities)
    } catch (err) {
      console.error('Error unpinning city:', err)
      setError('Failed to unpin city')
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar currentPage="profile" onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400">Please log in to view your profile.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar 
        currentPage="profile" 
        onLogout={onLogout} 
        userEmail={userData?.email} 
      />
      
      {/* Hero Section */}
      <div className="profile-hero pt-20 pb-12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Profile
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Manage your air quality monitoring preferences and view your activity history.
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="text-red-400 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* User Info Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <div className="text-lg text-white">
                      {userData.firstName && userData.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : userData.email.split('@')[0]
                      }
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <div className="text-lg text-white">{userData.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">User ID</label>
                    <div className="text-sm text-gray-300 font-mono">{userData.id}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Login</label>
                    <div className="text-sm text-gray-300">{userData.loginTime}</div>
                  </div>
                </div>
              </div>

              {/* Pinned Cities Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Pinned Cities 
                  <span className="text-blue-400 text-lg ml-3">({pinnedCities.length})</span>
                </h2>
                {pinnedCities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📌</div>
                    <p className="text-gray-400 mb-4">No pinned cities yet.</p>
                    <p className="text-sm text-gray-500">
                      Go to the Dashboard to pin cities for monitoring.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pinnedCitiesData.map((city, index) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                          <button
                            onClick={() => handleUnpinCity(city.name)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Unpin city"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className={`text-3xl font-bold mb-2 ${
                          city.aqi === 0 ? 'text-gray-400' :
                          city.aqi <= 50 ? 'text-green-400' :
                          city.aqi <= 100 ? 'text-yellow-400' :
                          city.aqi <= 150 ? 'text-orange-400' :
                          city.aqi <= 200 ? 'text-red-400' :
                          'text-purple-400'
                        }`}>
                          {city.aqi === 0 ? 'N/A' : city.aqi}
                        </div>
                        <div className="text-gray-300 mb-2">{city.status}</div>
                        <div className="text-sm text-blue-400">📌 Pinned</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Frequently Monitored Places Section */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Most Frequently Monitored Places
                  <span className="text-green-400 text-lg ml-3">({frequentCities.length})</span>
                </h2>
                {frequentCities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-400 mb-4">No monitoring data yet.</p>
                    <p className="text-sm text-gray-500">
                      Start monitoring cities on the Dashboard to see your activity here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {frequentCities.map((item, index) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className={`text-lg font-bold ${
                              index === 0 ? 'text-yellow-400' :
                              index === 1 ? 'text-gray-300' :
                              index === 2 ? 'text-orange-400' :
                              'text-green-400'
                            }`}>
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                              <div className="text-sm text-gray-400">
                                Monitored {item.count} time{item.count !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{item.count}</div>
                            <div className="text-xs text-gray-500">monitors</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => window.location.hash = '#dashboard'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium mr-4"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => window.location.hash = '#analytics'}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  View Analytics
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
