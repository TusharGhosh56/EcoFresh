import { useAirQuality } from '../hooks/useAirQuality'

export default function StatsGrid() {
  const { cities, loading, error, refreshData } = useAirQuality()

  if (loading) {
    return (
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="stat-card glass-effect rounded-3xl p-8 animate-pulse">
            <div className="stat-header flex justify-between items-center mb-5">
              <div className="h-6 bg-white/20 rounded w-32"></div>
              <div className="h-6 bg-white/20 rounded w-20"></div>
            </div>
            <div className="h-10 bg-white/20 rounded w-16 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-24 mb-5"></div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="h-16 bg-white/20 rounded"></div>
              <div className="h-16 bg-white/20 rounded"></div>
              <div className="h-16 bg-white/20 rounded"></div>
            </div>
            <div className="h-1 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="stats-grid mb-16">
        <div className="glass-effect rounded-3xl p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Unable to Load Data</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button 
              onClick={refreshData}
              className="bg-gradient-to-r from-[#00d4ff] to-[#5e72e4] px-6 py-2 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {cities.map((stat, index) => (
        <div key={index} className="stat-card glass-effect rounded-3xl p-8 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[#00d4ff]/10 before:to-transparent before:-translate-x-full before:transition-transform before:duration-600 hover:before:translate-x-full">
          <div className="stat-header flex justify-between items-center mb-5">
            <div className="stat-title text-xl font-semibold text-white/90">
              {stat.city}
            </div>
            <div className={`stat-tag px-3 py-1.5 rounded-2xl text-xs font-semibold uppercase ${stat.bgClass}`}>
              {stat.status}
            </div>
          </div>
          
          <div className="stat-value text-4xl font-extrabold mb-2" style={{ color: stat.color }}>
            {stat.aqi}
          </div>
          
          <div className="stat-location text-white/60 text-sm mb-5">
            {stat.location}
          </div>
          
          <div className="stat-details grid grid-cols-3 gap-4 mb-5">
            <div className="detail-item text-center p-2.5 bg-white/[0.03] rounded-xl">
              <div className="detail-label text-xs text-white/60 mb-1">PM2.5</div>
              <div className="detail-value font-semibold text-sm">{stat.details.pm25}</div>
            </div>
            <div className="detail-item text-center p-2.5 bg-white/[0.03] rounded-xl">
              <div className="detail-label text-xs text-white/60 mb-1">PM10</div>
              <div className="detail-value font-semibold text-sm">{stat.details.pm10}</div>
            </div>
            <div className="detail-item text-center p-2.5 bg-white/[0.03] rounded-xl">
              <div className="detail-label text-xs text-white/60 mb-1">O₃</div>
              <div className="detail-value font-semibold text-sm">{stat.details.o3}</div>
            </div>
          </div>
          
          <div className="loading-bar w-full h-1 bg-white/10 rounded-sm overflow-hidden mt-2.5">
            <div 
              className="loading-progress h-full rounded-sm transition-all duration-[2s] ease-out" 
              style={{ 
                width: `${Math.min(stat.aqi, 100)}%`,
                background: stat.aqi > 100 ? stat.color : `linear-gradient(45deg, #00d4ff, #5e72e4)`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
} 