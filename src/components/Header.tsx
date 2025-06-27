import { useAirQuality } from '../hooks/useAirQuality'

export default function Header() {
  const { refreshData, loading } = useAirQuality()

  const navigateTo = (hash: string) => {
    // Smooth navigation with proper state management
    if (hash === '') {
      window.location.hash = ''
    } else {
      window.location.hash = hash
    }
  }

  return (
    <header className="header fixed top-0 w-full backdrop-blur-[20px] bg-black/90 border-b border-white/10 z-[1000] py-2" style={{ opacity: 1 }}>
      <div className="container max-w-[1400px] mx-auto px-5">
        <nav className="nav flex justify-between items-center h-16" style={{ opacity: 1 }}>
          <div 
            className="logo text-2xl font-bold cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => navigateTo('')}
            style={{ 
              background: 'linear-gradient(45deg, #00d4ff, #5e72e4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 1
            }}
          >
            EcoFresh
          </div>
          
          <div className="flex items-center gap-6" style={{ opacity: 1 }}>
            <ul className="nav-links hidden md:flex gap-6 list-none m-0" style={{ opacity: 1 }}>
              <li>
                <button 
                  onClick={() => navigateTo('#dashboard')}
                  className="text-white font-medium text-sm transition-all duration-300 relative hover:text-[#00d4ff] bg-transparent border-none cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#air-quality')}
                  className="text-white font-medium text-sm transition-all duration-300 relative hover:text-[#00d4ff] bg-transparent border-none cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  Air Quality
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#analytics')}
                  className="text-white font-medium text-sm transition-all duration-300 relative hover:text-[#00d4ff] bg-transparent border-none cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#news')}
                  className="text-white font-medium text-sm transition-all duration-300 relative hover:text-[#00d4ff] bg-transparent border-none cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  News
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#about')}
                  className="text-white font-medium text-sm transition-all duration-300 relative hover:text-[#00d4ff] bg-transparent border-none cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  About
                </button>
              </li>
            </ul>
            
            {/* Mobile menu toggle */}
            <button className="md:hidden text-white" style={{ opacity: 1 }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-medium transition-all duration-300 hover:bg-white/10 hover:border-[#00d4ff]/50 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#00d4ff]'
              }`}
              title="Refresh air quality data"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <svg 
                className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="hidden sm:inline">
                {loading ? 'Updating...' : 'Refresh'}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
} 