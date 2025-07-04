import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainPage from './components/MainPageNew'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'

function App() {
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'analytics' | 'news' | 'about'>('main')

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

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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
        {currentView === 'main' && <MainPage />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'news' && <News />}
        {currentView === 'about' && <About />}
      </motion.div>
    </div>
  )
}

export default App
