import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Hero from './Hero'
import Footer from './Footer'
import { useAirQuality } from '../hooks/useAirQuality'

export default function MainPage() {
  const { cities } = useAirQuality()

  const globalStats = {
    totalCities: cities.length,
    avgAQI: cities.length > 0 ? Math.round(cities.reduce((sum, city) => sum + city.aqi, 0) / cities.length) : 0,
    goodAirCities: cities.filter(city => city.aqi <= 50).length,
    poorAirCities: cities.filter(city => city.aqi > 150).length
  }

  // Animation variants for different sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  }

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  const statsVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotateY: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7
      }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]"
    >
      <motion.div variants={sectionVariants}>
        <Navbar currentPage="" />
      </motion.div>
      
      <main>
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          {/* Air Quality Overview Section */}
          <section id="air-quality" className="py-20 px-5">
            <div className="container max-w-[1400px] mx-auto">
              <motion.div 
                variants={sectionVariants}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                  Improve Your City's Air Quality
                </h2>
                <p className="text-xl text-white/70 max-w-[700px] mx-auto">
                  Take action today to create cleaner, healthier air for everyone. Small changes make a big difference.
                </p>
              </motion.div>

              {/* Global Statistics */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              >
                <motion.div variants={statsVariants} className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#00d4ff] mb-2">{globalStats.totalCities}</div>
                  <div className="text-white/70 text-sm">Cities Monitored</div>
                </motion.div>
                <motion.div variants={statsVariants} className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#22c55e] mb-2">{globalStats.avgAQI}</div>
                  <div className="text-white/70 text-sm">Global Avg AQI</div>
                </motion.div>
                <motion.div variants={statsVariants} className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#10b981] mb-2">{globalStats.goodAirCities}</div>
                  <div className="text-white/70 text-sm">Good Air Quality</div>
                </motion.div>
                <motion.div variants={statsVariants} className="glass-effect rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-[#ef4444] mb-2">{globalStats.poorAirCities}</div>
                  <div className="text-white/70 text-sm">Poor Air Quality</div>
                </motion.div>
              </motion.div>

              {/* Ways to Improve Air Quality */}
              <motion.div variants={sectionVariants} className="mb-16">
                <h3 className="text-3xl font-bold text-white mb-12 text-center">Ways to Improve Air Quality</h3>
                <motion.div 
                  variants={containerVariants}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4 text-orange-400 font-bold">TRANSPORT</div>
                    <h4 className="text-xl font-bold text-white mb-4">Reduce Vehicle Emissions</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Use public transportation</li>
                      <li>• Walk or bike for short distances</li>
                      <li>• Carpool or rideshare</li>
                      <li>• Consider electric vehicles</li>
                      <li>• Maintain your vehicle properly</li>
                    </ul>
                  </motion.div>

                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4 text-blue-400 font-bold">HOME</div>
                    <h4 className="text-xl font-bold text-white mb-4">Home & Energy</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Use energy-efficient appliances</li>
                      <li>• Switch to renewable energy</li>
                      <li>• Improve home insulation</li>
                      <li>• Use LED lighting</li>
                      <li>• Avoid burning wood or trash</li>
                    </ul>
                  </motion.div>

                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4 text-green-400 font-bold">NATURE</div>
                    <h4 className="text-xl font-bold text-white mb-4">Plant & Protect</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Plant trees and maintain gardens</li>
                      <li>• Support urban green spaces</li>
                      <li>• Use native plants</li>
                      <li>• Avoid chemical pesticides</li>
                      <li>• Create green roofs/walls</li>
                    </ul>
                  </motion.div>

                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4 text-teal-400 font-bold">RECYCLE</div>
                    <h4 className="text-xl font-bold text-white mb-4">Reduce & Recycle</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Recycle properly</li>
                      <li>• Reduce plastic consumption</li>
                      <li>• Compost organic waste</li>
                      <li>• Choose reusable products</li>
                      <li>• Buy local and sustainable</li>
                    </ul>
                  </motion.div>

                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4 text-gray-400 font-bold">INDUSTRY</div>
                    <h4 className="text-xl font-bold text-white mb-4">Industrial Action</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Support clean industries</li>
                      <li>• Advocate for regulations</li>
                      <li>• Report pollution violations</li>
                      <li>• Choose eco-friendly products</li>
                      <li>• Invest in green companies</li>
                    </ul>
                  </motion.div>

                  <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-xl font-bold text-white mb-4">Community Action</h4>
                    <ul className="text-white/70 space-y-2">
                      <li>• Join environmental groups</li>
                      <li>• Educate others</li>
                      <li>• Participate in clean-up drives</li>
                      <li>• Vote for environmental policies</li>
                      <li>• Volunteer for green initiatives</li>
                    </ul>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Health Precautions and Do's & Don'ts */}
              <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8 mb-16">
                <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">🛡️ Health Precautions</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-red-400 font-semibold mb-2">High Pollution Days</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Stay indoors, especially during peak hours</li>
                        <li>• Keep windows and doors closed</li>
                        <li>• Use air purifiers if available</li>
                        <li>• Wear N95 masks when going outside</li>
                        <li>• Avoid outdoor exercise</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="text-orange-400 font-semibold mb-2">Moderate Pollution</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Limit prolonged outdoor activities</li>
                        <li>• Exercise indoors when possible</li>
                        <li>• Take frequent breaks if working outside</li>
                        <li>• Stay hydrated</li>
                        <li>• Monitor symptoms closely</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-green-400 font-semibold mb-2">Good Air Quality</div>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>• Perfect for all outdoor activities</li>
                        <li>• Great time for exercise and sports</li>
                        <li>• Open windows for fresh air</li>
                        <li>• Enjoy nature and outdoor spaces</li>
                        <li>• Plan outdoor events</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">✅ Do's & ❌ Don'ts</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                        <span>✅</span> DO's
                      </h4>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Check air quality daily before going out</li>
                        <li>• Use air purifiers in your home</li>
                        <li>• Plant air-purifying indoor plants</li>
                        <li>• Keep your living spaces well-ventilated</li>
                        <li>• Follow local air quality alerts</li>
                        <li>• Stay hydrated to help your body process toxins</li>
                        <li>• Eat antioxidant-rich foods</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                        <span>❌</span> DON'Ts
                      </h4>
                      <ul className="text-white/70 text-sm space-y-2">
                        <li>• Don't ignore air quality warnings</li>
                        <li>• Don't exercise outdoors during high pollution</li>
                        <li>• Don't burn leaves, trash, or wood unnecessarily</li>
                        <li>• Don't smoke or allow smoking indoors</li>
                        <li>• Don't use harsh chemicals or aerosols</li>
                        <li>• Don't idle your vehicle unnecessarily</li>
                        <li>• Don't ignore respiratory symptoms</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Understanding AQI */}
              <motion.div variants={sectionVariants} className="glass-effect rounded-2xl p-8 mb-16">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Understanding Air Quality Index (AQI)</h3>
                <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <motion.div variants={cardVariants} className="text-center p-4 bg-[#10b981]/20 border border-[#10b981]/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#10b981] mx-auto mb-2"></div>
                    <div className="text-white font-semibold">0-50</div>
                    <div className="text-[#10b981] font-medium">Good</div>
                    <div className="text-white/60 text-xs mt-1">Air quality is satisfactory</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-4 bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#22c55e] mx-auto mb-2"></div>
                    <div className="text-white font-semibold">51-100</div>
                    <div className="text-[#22c55e] font-medium">Moderate</div>
                    <div className="text-white/60 text-xs mt-1">Acceptable for most people</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-4 bg-[#f97316]/20 border border-[#f97316]/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#f97316] mx-auto mb-2"></div>
                    <div className="text-white font-semibold">101-150</div>
                    <div className="text-[#f97316] font-medium">Unhealthy for Sensitive</div>
                    <div className="text-white/60 text-xs mt-1">May affect sensitive groups</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-4 bg-[#ef4444]/20 border border-[#ef4444]/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#ef4444] mx-auto mb-2"></div>
                    <div className="text-white font-semibold">151-200</div>
                    <div className="text-[#ef4444] font-medium">Unhealthy</div>
                    <div className="text-white/60 text-xs mt-1">Health warnings for everyone</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-4 bg-[#dc2626]/20 border border-[#dc2626]/30 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#dc2626] mx-auto mb-2"></div>
                    <div className="text-white font-semibold">201+</div>
                    <div className="text-[#dc2626] font-medium">Very Unhealthy</div>
                    <div className="text-white/60 text-xs mt-1">Emergency conditions</div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Key Pollutants */}
              <motion.div variants={sectionVariants} className="glass-effect rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Key Air Pollutants</h3>
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={cardVariants} className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM2.5</div>
                    <div className="text-white/70 text-sm mb-3">Fine particulate matter that can penetrate deep into lungs and bloodstream</div>
                    <div className="text-white/60 text-xs">Sources: Vehicle exhaust, industrial emissions, wildfires</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-[#00d4ff] text-2xl font-bold mb-2">PM10</div>
                    <div className="text-white/70 text-sm mb-3">Larger particles that can cause respiratory issues and eye irritation</div>
                    <div className="text-white/60 text-xs">Sources: Dust storms, construction, road dust</div>
                  </motion.div>
                  <motion.div variants={cardVariants} className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-[#00d4ff] text-2xl font-bold mb-2">O₃</div>
                    <div className="text-white/70 text-sm mb-3">Ground-level ozone that can trigger asthma and reduce lung function</div>
                    <div className="text-white/60 text-xs">Sources: Vehicle exhaust + sunlight, industrial processes</div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </main>
      
      <motion.div variants={sectionVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  )
}
