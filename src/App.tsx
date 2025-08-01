import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AuthWrapper from './components/AuthWrapper'

import MainPage from './components/MainPageNew'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'

interface UserData {
  id: number
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'analytics' | 'news' | 'about'>('main')

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('ecofresh_user')
    const savedToken = localStorage.getItem('ecofresh_token')
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser)
        setUserData(user)
        setIsAuthenticated(true)

      } catch {
        // Invalid saved data, clear it
        localStorage.removeItem('ecofresh_user')
        localStorage.removeItem('ecofresh_token')
      }
    }
  }, [])

  // Handle successful authentication
  const handleAuthSuccess = (user: UserData) => {
    setUserData(user)
    setIsAuthenticated(true)

  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('ecofresh_user')
    localStorage.removeItem('ecofresh_token')
    setUserData(null)
    setIsAuthenticated(false)
    setCurrentView('main')
    window.location.hash = ''
  }



  // Handle navigation
  useEffect(() => {
    if (!isAuthenticated) return

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

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [isAuthenticated])

  // If not authenticated, show login/signup
  if (!isAuthenticated) {
    return <AuthWrapper onAuthSuccess={handleAuthSuccess} />
  }

  // If authenticated but splash is showing


  // Main application after authentication and splash
  return (
    <div className="min-h-screen text-white relative">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="min-h-screen"
      >
        {currentView === 'main' && <MainPage userData={userData} onLogout={handleLogout} />}
        {currentView === 'dashboard' && <Dashboard userData={userData} onLogout={handleLogout} />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'news' && <News />}
        {currentView === 'about' && <About />}
      </motion.div>
    </div>
  )
}

export default App
