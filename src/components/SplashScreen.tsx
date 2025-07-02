import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface SplashScreenProps {
  onComplete: () => void
  mainContentRef?: React.RefObject<HTMLDivElement | null>
}

export default function SplashScreen({ onComplete, mainContentRef }: SplashScreenProps) {
  const splashRef = useRef<HTMLDivElement>(null)
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
        createWindBlowAndZoomAnimation()
        // Remove scroll listener after first trigger
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Fallback: auto-complete if no scroll after 6 seconds
    const fallbackTimer = setTimeout(() => {
      window.removeEventListener('scroll', handleScroll)
      createWindBlowAndZoomAnimation()
    }, 6000)

    // Cleanup function to remove all created elements
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(fallbackTimer)
      
      // Clean up any remaining leaves
      const remainingLeaves = document.querySelectorAll('.falling-leaf');
      remainingLeaves.forEach(leaf => {
        if (leaf.parentNode) {
          leaf.remove();
        }
      });
      
      // Kill all GSAP animations related to this component
      gsap.killTweensOf("*");
    }
  }, [onComplete, mainContentRef])

  const createFallingLeaves = () => {
    if (!splashRef.current) return;
    
    const leafShapes = ['🍃', '🍂', '🌿', '🍀', '🌱', '🌾', '🍁'];
    
    // Create leaves with enhanced visibility and wind responsiveness
    for (let i = 0; i < 50; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'falling-leaf wind-responsive';
      leaf.textContent = leafShapes[Math.floor(Math.random() * leafShapes.length)];
      
      const startX = Math.random() * window.innerWidth;
      const leafSize = Math.random() * 25 + 18;
      const leafOpacity = Math.random() * 0.4 + 0.6;
      const leafColor = Math.random() > 0.5 ? '#00d4ff' : '#22c55e'; // Match site theme colors
      
      leaf.style.cssText = `
        position: fixed;
        font-size: ${leafSize}px;
        color: ${leafColor};
        opacity: ${leafOpacity};
        z-index: 10001;
        pointer-events: none;
        left: ${startX}px;
        top: -50px;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
        user-select: none;
        text-shadow: 0 0 8px ${leafColor === '#00d4ff' ? 'rgba(0,212,255,0.6)' : 'rgba(34,197,94,0.6)'};
        transition: all 0.3s ease-out;
      `;
      
      // Append to body for global positioning
      document.body.appendChild(leaf);
      
      // Create staggered animation timeline for each leaf
      const leafTl = gsap.timeline();
      
      // Set initial state
      gsap.set(leaf, {
        scale: 0,
        rotation: Math.random() * 360
      });
      
      // Entrance animation with varied delay
      leafTl.to(leaf, {
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: Math.random() * 4 + 0.5
      })
      
      // Main falling animation with natural physics
      .to(leaf, {
        y: window.innerHeight + 150,
        x: startX + (Math.random() * 400 - 200),
        rotation: Math.random() * 1080 + 360,
        duration: Math.random() * 10 + 12,
        ease: "power1.out"
      }, "-=0.3")
      
      // Add realistic sway motion during fall
      .to(leaf, {
        x: `+=${Math.random() * 140 - 70}`,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }, "-=12")
      
      // Add subtle scale pulsing for life-like effect
      .to(leaf, {
        scale: `+=${Math.random() * 0.3 + 0.1}`,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }, "-=12")
      
      // Cleanup when animation completes
      .call(() => {
        if (leaf && leaf.parentNode) {
          leaf.remove();
        }
      });
    }
  }

  const createSlowWind = () => {
    if (!splashRef.current) return

    // Create subtle slow wind effect throughout the animation
    const createWindLine = () => {
      if (!splashRef.current) return

      const windLine = document.createElement('div')
      windLine.className = 'absolute pointer-events-none'
      
      const lineWidth = Math.random() * 300 + 200;
      const lineOpacity = Math.random() * 0.15 + 0.05;
      const yPosition = Math.random() * 100;
      
      windLine.style.cssText = `
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,${lineOpacity}) 20%, rgba(255,255,255,${lineOpacity * 2}) 50%, rgba(255,255,255,${lineOpacity}) 80%, transparent 100%);
        width: ${lineWidth}px;
        top: ${yPosition}%;
        left: -${lineWidth}px;
        z-index: 10000;
        filter: blur(0.5px);
      `;
      
      splashRef.current.appendChild(windLine)

      // Slow wind movement
      gsap.to(windLine, {
        x: window.innerWidth + lineWidth,
        duration: Math.random() * 8 + 12, // Very slow (12-20 seconds)
        ease: 'none',
        onComplete: () => {
          if (windLine.parentNode) {
            windLine.remove();
          }
        }
      })

      // Subtle opacity pulsing
      gsap.to(windLine, {
        opacity: lineOpacity * 3,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }

    // Create initial wind lines
    for (let i = 0; i < 8; i++) {
      setTimeout(createWindLine, Math.random() * 2000)
    }

    // Continue creating slow wind lines
    const windInterval = setInterval(createWindLine, 2000)
    
    setTimeout(() => clearInterval(windInterval), 8000)
  }

  const animateEntrance = () => {
    if (!textRef.current || !taglineRef.current || !scrollIndicatorRef.current) return

    // Initial state - everything hidden
    gsap.set([textRef.current, taglineRef.current, scrollIndicatorRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate entrance sequence
    const tl = gsap.timeline()
    
    // EcoFresh text appears first
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    
    // Tagline appears
    .to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    
    // Scroll indicator appears last
    .to(scrollIndicatorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
  }

  const createWindBlowAndZoomAnimation = () => {
    if (!textRef.current || !taglineRef.current || !scrollIndicatorRef.current || !splashRef.current) return

    // Create enhanced wind effect elements
    const windLines = []
    for (let i = 0; i < 30; i++) {
      const windLine = document.createElement('div')
      windLine.className = 'absolute pointer-events-none'
      
      const lineHeight = Math.random() * 4 + 2;
      const lineOpacity = Math.random() * 0.7 + 0.3;
      const lineWidth = Math.random() * 600 + 500;
      const yPosition = 2 + i * 3;
      
      windLine.style.cssText = `
        height: ${lineHeight}px;
        background: linear-gradient(90deg, transparent 0%, rgba(0,212,255,${lineOpacity * 0.5}) 20%, rgba(255,255,255,${lineOpacity}) 40%, rgba(0,212,255,${lineOpacity * 0.8}) 60%, rgba(255,255,255,${lineOpacity}) 80%, transparent 100%);
        width: ${lineWidth}px;
        top: ${yPosition}%;
        left: -${lineWidth}px;
        z-index: 10003;
        box-shadow: 0 0 20px rgba(0,212,255,0.4);
        filter: blur(1px);
      `;
      
      splashRef.current.appendChild(windLine)
      windLines.push(windLine)

      // Animate wind lines
      gsap.to(windLine, {
        x: window.innerWidth + lineWidth + 300,
        duration: 0.8 + i * 0.02,
        ease: 'power3.out',
        delay: i * 0.01,
        onComplete: () => {
          if (windLine.parentNode) {
            windLine.remove();
          }
        }
      })
    }

    // Blow away all leaves with enhanced physics
    const existingLeaves = document.querySelectorAll('.falling-leaf');
    existingLeaves.forEach((leaf) => {
      gsap.to(leaf, {
        x: window.innerWidth + 400,
        y: `+=${Math.random() * 200 - 100}`,
        rotation: `+=${Math.random() * 1080 + 540}`,
        scale: 0.1,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: Math.random() * 0.3,
        onComplete: () => {
          if (leaf.parentNode) {
            leaf.remove();
          }
        }
      });
    });

    // Create a cinematic transition timeline
    const masterTl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => onComplete(), 100);
      }
    })

    // Phase 1: Initial wind buildup and trembling (0-0.8s)
    masterTl
    // Subtle camera shake
    .to(splashRef.current, {
      x: 'random(-3, 3)',
      y: 'random(-2, 2)',
      duration: 0.05,
      repeat: 10,
      yoyo: true,
      ease: 'power2.inOut'
    }, 0.1)
    
    // All text elements start trembling together
    .to([textRef.current, taglineRef.current], {
      x: 'random(-3, 3)',
      y: 'random(-2, 2)',
      rotation: 'random(-0.5, 0.5)',
      duration: 0.06,
      repeat: 10,
      yoyo: true,
      ease: 'power2.inOut'
    }, 0.2)

    // Phase 2: Wind intensifies (0.8-1.5s)
    .to([textRef.current, taglineRef.current], {
      x: 'random(-6, 6)',
      y: 'random(-4, 4)',
      rotation: 'random(-2, 2)',
      duration: 0.05,
      repeat: 15,
      yoyo: true,
      ease: 'power2.inOut'
    }, 0.8)

    // Phase 3: Major wind blast - ALL elements blown away SIMULTANEOUSLY (1.5-2.8s)
    .to(scrollIndicatorRef.current, {
      y: 400,
      x: 300,
      rotation: 120,
      scale: 0.1,
      opacity: 0,
      duration: 1.3,
      ease: 'power4.out'
    }, 1.5)
    
    // ALL TEXT ELEMENTS BLOWN AWAY AT EXACTLY THE SAME TIME
    .to([textRef.current, taglineRef.current], {
      x: window.innerWidth + 800,
      y: 'random(-60, 60)',
      rotation: 'random(15, 45)',
      scale: 0.2,
      opacity: 0,
      duration: 1.3,
      ease: 'power4.out',
      stagger: 0 // No stagger - all move together
    }, 1.5) // Same exact start time for all

    // Phase 4: Brief pause for cinematic effect (2.8-3.2s)
    .to(splashRef.current, {
      scale: 1.02,
      duration: 0.4,
      ease: 'power1.inOut'
    }, 2.8)

    // Phase 5: Fade out splash and start revealing main content (3.2-4.5s)
    .to(splashRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(5px)',
      duration: 1.3,
      ease: 'power2.out'
    }, 3.2)
    
    // Simultaneously start revealing main content with zoom effect (only if ref exists)
    if (mainContentRef?.current) {
      masterTl.to(mainContentRef.current, {
        visibility: 'visible',
        scale: 0.6,
        opacity: 0.3,
        filter: 'blur(15px)',
        duration: 0.1,
        ease: 'none'
      }, 3.2)

      // Phase 6: Smooth zoom-in and content reveal (3.3-5.5s)
      .to(mainContentRef.current, {
        scale: 0.85,
        opacity: 0.7,
        filter: 'blur(8px)',
        duration: 1.0,
        ease: 'power2.out'
      }, 3.3)
      
      .to(mainContentRef.current, {
        scale: 0.95,
        opacity: 0.9,
        filter: 'blur(3px)',
        duration: 0.8,
        ease: 'power2.out'
      }, 4.3)
      
      // Final reveal - content fully visible
      .to(mainContentRef.current, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power2.out'
      }, 5.1)
    }
  }

  return (
    <div 
      ref={splashRef}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center"
    >
      {/* Background gradient overlay for depth - matching main site */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-teal-800/15 to-green-900/20"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,212,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.15)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.15)_0%,transparent_50%)]"></div>
      </div>

      {/* Main EcoFresh Logo */}
      <div ref={textRef} className="text-center z-20 absolute">
        <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-4 filter drop-shadow-lg">
          <span className="bg-gradient-to-r from-[#00d4ff] via-white to-[#22c55e] bg-clip-text text-transparent">
            EcoFresh
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <div ref={taglineRef} className="text-center z-20 absolute mt-32">
        <p className="text-xl md:text-2xl text-white/80 font-medium filter drop-shadow-sm">
          <span className="text-[#00d4ff]">Breathe Pure</span>, <span className="text-[#22c55e]">Live Better</span>
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="flex flex-col items-center text-white/60 arrow-bounce">
          <p className="text-sm mb-2 font-medium">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-[#00d4ff]/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#00d4ff]/70 rounded-full mt-2 animate-pulse"></div>
          </div>
          <svg 
            className="w-6 h-6 mt-2 text-[#00d4ff]/60" 
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