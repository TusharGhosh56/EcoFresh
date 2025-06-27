import { useState, useEffect } from 'react'
import MainPage from './components/MainPage'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'
import SplashScreen from './components/SplashScreen'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'analytics' | 'news' | 'about'>('main')
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#dashboard' || hash === '#dashboard-page') {
        setCurrentView('dashboard')
      } else if (hash === '#analytics') {
        setCurrentView('analytics')
      } else if (hash === '#news') {
        setCurrentView('news')
      } else if (hash === '#about') {
        setCurrentView('about')
      } else {
        setCurrentView('main')
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {currentView === 'main' && <MainPage />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'analytics' && <Analytics />}
      {currentView === 'news' && <News />}
      {currentView === 'about' && <About />}
    </div>
  )
}

export default App
