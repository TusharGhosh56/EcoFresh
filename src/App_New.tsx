import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainPageNew from './components/MainPageNew'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import News from './components/News'
import About from './components/About'

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

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.05,
              filter: "blur(8px)",
              transition: { 
                duration: 1.0,
                ease: "easeInOut"
              }
            }}
            className="fixed inset-0 z-[10000]"
          >
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ 
              opacity: 0, 
              scale: 0.85,
              filter: "blur(15px)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{ 
              duration: 1.8,
              ease: "easeOut",
              delay: 0.1
            }}
            className="min-h-screen"
          >
            {currentView === 'main' && <MainPageNew />}
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'news' && <News />}
            {currentView === 'about' && <About />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
