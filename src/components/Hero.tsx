import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    createParticles()
    initAnimations()
  }, [])

  const createParticles = () => {
    if (!heroRef.current) return

    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      heroRef.current.appendChild(particle)

      // Animate particles
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      })

      gsap.to(particle, {
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 3 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      })
    }
  }

  const initAnimations = () => {
    // Simplified animations to prevent hiding content
    gsap.set('.hero-content', { opacity: 1, y: 0 })
    gsap.set('.hero h1', { opacity: 1, y: 0 })
    gsap.set('.hero p', { opacity: 1, y: 0 })
    gsap.set('.cta-button', { opacity: 1, y: 0 })
    gsap.set('.cta-button-secondary', { opacity: 1, y: 0 })
    
    // Simple fade-in animation
    gsap.fromTo('.hero-content', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
    )
  }

  const goToDashboard = () => {
    window.location.hash = '#dashboard'
  }

  return (
    <section ref={heroRef} className="hero h-[70vh] flex items-center relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-[#5e72e4]/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(94,114,228,0.1)_0%,transparent_50%)]"></div>
      
      <div className="container max-w-[1400px] mx-auto px-5 relative z-10">
        <div className="hero-content text-center lg:text-left opacity-100">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[1.1] text-white">
            <span className="bg-gradient-to-r from-white via-[#00d4ff] to-[#5e72e4] bg-clip-text text-transparent">
              Breathe Clean,
            </span>
            <br />
            <span className="text-white">Live Healthy</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-[700px] mx-auto lg:mx-0 leading-relaxed opacity-100">
            Monitor real-time air quality worldwide with EcoFresh. Stay informed about air pollution levels, protect your health, and make better decisions for you and your family.
          </p>
          <div className="flex justify-center lg:justify-start opacity-100">
            <button 
              onClick={goToDashboard}
              className="cta-button-secondary border-2 border-[#00d4ff] bg-transparent py-4 px-10 rounded-full text-[#00d4ff] text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-[#00d4ff] hover:text-white hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,212,255,0.2)] opacity-100"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 