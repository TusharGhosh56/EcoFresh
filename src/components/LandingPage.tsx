import Header from './Header'
import Hero from './Hero'
import StatsGrid from './StatsGrid'
import { useAirQuality } from '../hooks/useAirQuality'

interface LandingPageProps {
  onComplete: () => void
}

function LandingPage({ onComplete }: LandingPageProps) {
  const { cities } = useAirQuality()

  // Call onComplete immediately since we're showing the main page now
  onComplete()

  const globalStats = {
    totalCities: cities.length,
    avgAQI: cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 0,
    goodAirCities: cities.filter(city => city.aqi <= 50).length,
    poorAirCities: cities.filter(city => city.aqi > 150).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      <Header />
      
      <main>
        <Hero />
        
        {/* Air Quality Overview Section */}
        <section id="air-quality" className="py-20 px-5">
          <div className="container max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Global Air Quality Overview
              </h2>
              <p className="text-xl text-white/70 max-w-[700px] mx-auto">
                Real-time air quality monitoring across major cities worldwide. Stay informed about pollution levels and make healthier choices.
              </p>
            </div>

            {/* Global Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#00d4ff] mb-2">{globalStats.totalCities}</div>
                <div className="text-white/70 text-sm">Cities Monitored</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#22c55e] mb-2">{globalStats.avgAQI}</div>
                <div className="text-white/70 text-sm">Global Avg AQI</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#10b981] mb-2">{globalStats.goodAirCities}</div>
                <div className="text-white/70 text-sm">Good Air Quality</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-[#ef4444] mb-2">{globalStats.poorAirCities}</div>
                <div className="text-white/70 text-sm">Poor Air Quality</div>
              </div>
            </div>

            {/* Air Quality Cards */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">Live Air Quality Data</h3>
              <StatsGrid />
            </div>

            {/* Air Quality Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Understanding AQI</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
                    <div>
                      <div className="text-white font-semibold">0-50: Good</div>
                      <div className="text-white/60 text-sm">Air quality is satisfactory</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                    <div>
                      <div className="text-white font-semibold">51-100: Moderate</div>
                      <div className="text-white/60 text-sm">Acceptable for most people</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
                    <div>
                      <div className="text-white font-semibold">101-150: Unhealthy for Sensitive</div>
                      <div className="text-white/60 text-sm">May affect sensitive individuals</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                    <div>
                      <div className="text-white font-semibold">151+: Unhealthy</div>
                      <div className="text-white/60 text-sm">Health warnings for everyone</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Health Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-[#10b981] font-semibold mb-2">Good Air Quality</div>
                    <div className="text-white/70 text-sm">Perfect for outdoor activities. Enjoy fresh air!</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-[#f97316] font-semibold mb-2">Moderate Pollution</div>
                    <div className="text-white/70 text-sm">Limit prolonged outdoor exertion for sensitive groups.</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-[#ef4444] font-semibold mb-2">Poor Air Quality</div>
                    <div className="text-white/70 text-sm">Avoid outdoor activities. Stay indoors when possible.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Indicators */}
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Key Pollutants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM2.5</div>
                  <div className="text-white/70 text-sm">Fine particulate matter that can penetrate deep into lungs</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM10</div>
                  <div className="text-white/70 text-sm">Larger particles that can cause respiratory issues</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-[#00d4ff] text-2xl font-bold mb-2">O₃</div>
                  <div className="text-white/70 text-sm">Ground-level ozone that can trigger asthma</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage 