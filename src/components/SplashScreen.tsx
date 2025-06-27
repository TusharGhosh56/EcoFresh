import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const splashRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    createFallingLeaves()
    createSlowWind()
    animateEntrance()
    
    // Add scroll listener for wind animation
    const handleScroll = () => {
      if (window.scrollY > 20) {
        createWindBlowAnimation()
        // Remove scroll listener after first trigger
        window.removeEventListener('scroll', handleScroll)
        // Trigger exit after wind animation
        setTimeout(() => {
          exitAnimation()
        }, 2000)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Fallback: auto-complete if no scroll after 6 seconds
    const fallbackTimer = setTimeout(() => {
      window.removeEventListener('scroll', handleScroll)
      createWindBlowAnimation()
      setTimeout(() => {
        exitAnimation()
      }, 2000)
    }, 6000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const createFallingLeaves = () => {
    if (!splashRef.current) return

    const leafCount = 50
    // Create continuous falling leaves with simple shapes
    const leafShapes = ['♦', '♠', '♣', '•']

    // Create continuous falling leaves
    const createLeaf = () => {
      if (!splashRef.current) return

      const leaf = document.createElement('div')
      leaf.className = 'leaf absolute pointer-events-none'
      leaf.style.fontSize = `${Math.random() * 15 + 12}px`
      leaf.textContent = leafShapes[Math.floor(Math.random() * leafShapes.length)]
      leaf.style.left = Math.random() * 110 - 5 + '%' // Start slightly off-screen
      leaf.style.top = '-60px'
      leaf.style.opacity = '0.8'
      leaf.style.zIndex = '10'
      leaf.style.filter = 'sepia(20%) saturate(150%) hue-rotate(10deg)'
      splashRef.current.appendChild(leaf)

      // Slower falling animation with gentle sway
      gsap.to(leaf, {
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 150,
        rotation: Math.random() * 360 - 180,
        duration: Math.random() * 6 + 6, // Slower falling (6-12 seconds)
        ease: 'none',
        onComplete: () => leaf.remove()
      })

      // Gentle swaying motion (slower)
      gsap.to(leaf, {
        x: '+=' + (Math.random() * 60 - 30),
        duration: Math.random() * 4 + 3, // Slower sway
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Subtle opacity variation
      gsap.to(leaf, {
        opacity: Math.random() * 0.4 + 0.4,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    // Initial burst of leaves
    for (let i = 0; i < leafCount; i++) {
      setTimeout(createLeaf, Math.random() * 1500)
    }

    // Continue creating leaves throughout the animation (slower rate)
    const leafInterval = setInterval(createLeaf, 400)
    
    setTimeout(() => clearInterval(leafInterval), 4000)
  }

  const createSlowWind = () => {
    if (!splashRef.current) return

    // Create subtle slow wind effect throughout the animation
    const createWindLine = () => {
      if (!splashRef.current) return

      const windLine = document.createElement('div')
      windLine.className = 'absolute h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none'
      windLine.style.width = '400px'
      windLine.style.top = Math.random() * 100 + '%'
      windLine.style.left = '-400px'
      windLine.style.zIndex = '5'
      windLine.style.opacity = '0.3'
      splashRef.current.appendChild(windLine)

      // Slow wind movement
      gsap.to(windLine, {
        x: window.innerWidth + 400,
        duration: Math.random() * 8 + 12, // Very slow (12-20 seconds)
        ease: 'none',
        onComplete: () => windLine.remove()
      })

      // Subtle opacity pulsing
      gsap.to(windLine, {
        opacity: Math.random() * 0.2 + 0.1,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    // Create initial wind lines
    for (let i = 0; i < 5; i++) {
      setTimeout(createWindLine, Math.random() * 2000)
    }

    // Continue creating slow wind lines
    const windInterval = setInterval(createWindLine, 1500)
    
    setTimeout(() => clearInterval(windInterval), 4000)
  }

  const animateEntrance = () => {
    if (!logoRef.current || !textRef.current || !taglineRef.current || !scrollIndicatorRef.current) return

    // Initial state - everything hidden
    gsap.set([logoRef.current, textRef.current, taglineRef.current, scrollIndicatorRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate entrance sequence
    const tl = gsap.timeline()
    
    // Logo appears first
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    
    // Text appears
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    
    // Tagline appears
    .to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    
    // Scroll indicator appears last
    .to(scrollIndicatorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.1')
  }

  const createWindBlowAnimation = () => {
    if (!textRef.current || !taglineRef.current || !scrollIndicatorRef.current) return

    // Create wind effect elements
    const windLines = []
    for (let i = 0; i < 15; i++) {
      const windLine = document.createElement('div')
      windLine.className = 'absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent'
      windLine.style.width = '600px'
      windLine.style.top = `${15 + i * 6}%`
      windLine.style.left = '-600px'
      windLine.style.zIndex = '15'
      splashRef.current?.appendChild(windLine)
      windLines.push(windLine)

      // Animate wind lines with staggered timing
      gsap.to(windLine, {
        x: window.innerWidth + 600,
        duration: 1.2 + i * 0.08,
        ease: 'power3.out',
        delay: i * 0.03,
        onComplete: () => windLine.remove()
      })
    }

    // Blow away all elements with enhanced wind effect
    const windTl = gsap.timeline()
    
    // First, create a shaking effect on all elements
    windTl.to([textRef.current, taglineRef.current, logoRef.current], {
      x: 'random(-5, 5)',
      y: 'random(-3, 3)',
      rotation: 'random(-2, 2)',
      duration: 0.1,
      repeat: 8,
      yoyo: true,
      ease: 'power2.inOut'
    })
    
    // Hide scroll indicator first (blown down and away)
    .to(scrollIndicatorRef.current, {
      y: 150,
      x: 100,
      rotation: 45,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.5')
    
    // Blow away the text and tagline with more dramatic effect
    .to([textRef.current, taglineRef.current], {
      x: window.innerWidth + 300,
      y: 'random(-50, 50)',
      rotation: 'random(10, 25)',
      scale: 0.8,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.1
    }, '-=0.6')
    
    // Logo gets affected but stays longer with wind resistance
    .to(logoRef.current, {
      x: 80,
      y: -20,
      rotation: 8,
      scale: 0.85,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=1.0')
  }

  const exitAnimation = () => {
    if (!splashRef.current) return

    gsap.to(splashRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: onComplete
    })
  }

  return (
    <div 
      ref={splashRef}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-teal-700/20 to-green-800/30"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.3)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.3)_0%,transparent_50%)]"></div>
      </div>

      {/* Logo */}
      <div ref={logoRef} className="text-center z-20 absolute">
        <div className="text-7xl mb-4 filter drop-shadow-lg font-bold text-white"></div>
      </div>

      {/* Main text */}
      <div ref={textRef} className="text-center z-20 absolute">
        <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-4 filter drop-shadow-lg">
          EcoFresh
        </h1>
      </div>

      {/* Tagline */}
      <div ref={taglineRef} className="text-center z-20 absolute mt-32">
        <p className="text-xl md:text-2xl text-white/90 font-medium filter drop-shadow-sm">
          Breathe Pure, Live Better
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="flex flex-col items-center text-white/70 arrow-bounce">
          <p className="text-sm mb-2 font-medium">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
          <svg 
            className="w-6 h-6 mt-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>

      {/* Falling leaves container */}
      <div className="absolute inset-0 pointer-events-none z-10"></div>
    </div>
  )
} 