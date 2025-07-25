"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useSpring, animated, useTrail } from "@react-spring/web"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollReveal from "scrollreveal"
import {
  ShipWheelIcon,
  ArrowRight,
  FileText,
  MessageSquare,
  Brain,
  Calendar,
  Scan,
  Play,
  ChevronDown,
  Zap,
  Users,
  Target,
  BookOpen,
  Code,
  Monitor,
  Cpu,
  Database,
  Globe,
  Shield,
  X,
  Mail,
  Phone,
  MapPin,
  Send,
  Award,
  Heart,
  Menu,
  Home,
  Info,
  Contact,
  Settings,
} from "lucide-react"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Three.js Components
const FloatingGeometry = ({ position, color, geometry = "sphere" }) => {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "none",
      })
    }
  }, [])

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {geometry === "sphere" ? (
          <sphereGeometry args={[0.5, 32, 32]} />
        ) : geometry === "box" ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : (
          <octahedronGeometry args={[0.7]} />
        )}
        <MeshDistortMaterial color={color} attach="material" distort={0.3} speed={2} roughness={0.1} metalness={0.8} />
      </mesh>
    </Float>
  )
}

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />

      <FloatingGeometry position={[-3, 2, 0]} color="#10b981" geometry="sphere" />
      <FloatingGeometry position={[3, -1, 0]} color="#f59e0b" geometry="box" />
      <FloatingGeometry position={[0, 3, -2]} color="#8b5cf6" geometry="octahedron" />
      <FloatingGeometry position={[-2, -2, 1]} color="#ef4444" geometry="sphere" />
      <FloatingGeometry position={[2, 1, -1]} color="#06b6d4" geometry="box" />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

const InteractiveCard3D = ({ children, index }) => {
  const cardRef = useRef()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          rotationY: -90,
          opacity: 0,
          z: -100,
        },
        {
          rotationY: 0,
          opacity: 1,
          z: 0,
          duration: 1.2,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [index])

  return (
    <motion.div
      ref={cardRef}
      className="relative preserve-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotateX: isHovered ? 5 : 0,
        rotateY: isHovered ? 5 : 0,
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? 50 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrollMode, setIsScrollMode] = useState(true)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const laptopRefs = useRef([])
  const iconRefs = useRef([])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"])
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], ["0%", "-300%"])

  // Enhanced scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "components", "demo", "about", "contact"]
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // GSAP Animations with enhanced effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced parallax backgrounds with 3D transforms
      gsap.to(".parallax-bg-1", {
        yPercent: -30,
        rotationX: 5,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg-1",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to(".parallax-bg-2", {
        yPercent: -60,
        rotationY: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg-2",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      gsap.to(".parallax-bg-3", {
        yPercent: -90,
        rotationX: -3,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-bg-3",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      // Enhanced laptop animations
      laptopRefs.current.forEach((laptop, index) => {
        if (laptop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: laptop,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            },
          })

          tl.fromTo(
            laptop.querySelector(".laptop-screen"),
            {
              rotateX: -90,
              transformOrigin: "bottom center",
              opacity: 0,
            },
            {
              rotateX: 0,
              opacity: 1,
              duration: 1,
            },
          ).to(
            laptop.querySelector(".laptop-keyboard"),
            {
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.8)",
              scale: 1.02,
              duration: 0.5,
            },
            "-=0.5",
          )
        }
      })

      // Enhanced icon animations with 3D effects
      iconRefs.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(
            icon,
            {
              scale: 0,
              rotation: -360,
              opacity: 0,
              z: -100,
            },
            {
              scale: 1.2,
              rotation: 0,
              opacity: 1,
              z: 0,
              duration: 1.5,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: icon,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          )

          // Continuous floating animation
          gsap.to(icon, {
            y: -10,
            rotation: 10,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
            delay: index * 0.2,
          })
        }
      })

      // Text reveal animations
      gsap.utils.toArray(".reveal-text").forEach((text, index) => {
        gsap.fromTo(
          text,
          {
            opacity: 0,
            y: 50,
            rotationX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      // Enhanced card animations
      gsap.utils.toArray(".component-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            rotationY: -90,
            opacity: 0,
            z: -200,
            scale: 0.8,
          },
          {
            rotationY: 0,
            opacity: 1,
            z: 0,
            scale: 1,
            duration: 1.5,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // ScrollReveal for additional animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      ScrollReveal().reveal(".sr-reveal", {
        duration: 1000,
        distance: "50px",
        easing: "cubic-bezier(0.5, 0, 0, 1)",
        origin: "bottom",
        interval: 100,
        scale: 0.9,
        reset: false,
      })
    }
  }, [])

  const components = [
    {
      id: "roadmap",
      title: "Interactive Roadmap",
      description: "Plan your learning journey with our comprehensive roadmaps for different tech stacks.",
      icon: Calendar,
      color: "primary",
      gradient: "from-emerald-400 to-cyan-400",
      features: ["Personalized Learning Paths", "Progress Tracking", "Community Insights"],
      demoCode: `const roadmap = {\n  frontend: ['HTML', 'CSS', 'JavaScript'],\n  backend: ['Node.js', 'Express', 'MongoDB'],\n  progress: 75\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "cv-generator",
      title: "AI CV Generator",
      description: "Create professional resumes tailored to your target roles with AI assistance.",
      icon: FileText,
      color: "secondary",
      gradient: "from-amber-400 to-orange-400",
      features: ["ATS-Friendly Templates", "AI Content Suggestions", "Real-time Preview"],
      demoCode: `const generateCV = async (data) => {\n  const template = await AI.optimize(data)\n  return template.render()\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "mock-interview",
      title: "Mock Interview",
      description: "Practice with AI-powered mock interviews and get detailed feedback.",
      icon: MessageSquare,
      color: "accent",
      gradient: "from-violet-400 to-purple-400",
      features: ["Real-time Feedback", "Industry-specific Questions", "Performance Analytics"],
      demoCode: `const interview = {\n  question: "Explain React hooks",\n  answer: userResponse,\n  feedback: AI.analyze(userResponse)\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      description: "Sharpen your coding skills with curated problems and solutions.",
      icon: Brain,
      color: "primary",
      gradient: "from-emerald-400 to-teal-400",
      features: ["Multiple Difficulty Levels", "Detailed Explanations", "Code Playground"],
      demoCode: `function twoSum(nums, target) {\n  const map = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    // Solution logic here\n  }\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "posts",
      title: "Community Posts",
      description: "Share knowledge, ask questions, and connect with fellow developers.",
      icon: Users,
      color: "secondary",
      gradient: "from-amber-400 to-yellow-400",
      features: ["Rich Text Editor", "Code Snippets", "Community Voting"],
      demoCode: `const post = {\n  title: "React Best Practices",\n  content: markdown,\n  tags: ['react', 'javascript'],\n  votes: 42\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "face-auth",
      title: "Face Authentication",
      description: "Secure and instant login using advanced facial recognition technology.",
      icon: Scan,
      color: "accent",
      gradient: "from-violet-400 to-indigo-400",
      features: ["Biometric Security", "Instant Access", "Privacy Protected"],
      demoCode: `const faceAuth = async (image) => {\n  const features = await extractFeatures(image)\n  return await verifyIdentity(features)\n}`,
      videoUrl: "/placeholder.svg?height=400&width=600",
    },
  ]

  const trail = useTrail(components.length, {
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
    config: { mass: 5, tension: 2000, friction: 200 },
  })

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80

      if (isScrollMode) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: offsetTop },
          ease: "power2.inOut",
        })
      } else {
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }

      setActiveSection(sectionId)
      setIsMobileMenuOpen(false)
    }
  }

  const openVideoModal = (videoUrl) => {
    setIsVideoModalOpen(videoUrl)
  }

  return (
    <>
      {/* Enhanced Styles */}
      <style jsx>{`
        html {
          scroll-behavior: ${isScrollMode ? "auto" : "smooth"};
          overflow-x: hidden;
        }
        
        body {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: hsl(var(--b2));
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, hsl(var(--p)), hsl(var(--s)));
          border-radius: 6px;
          border: 2px solid hsl(var(--b2));
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, hsl(var(--pf)), hsl(var(--sf)));
        }

        /* 3D Effects */
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .perspective-2000 {
          perspective: 2000px;
        }

        /* Enhanced Laptop Animations */
        .laptop-container {
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .laptop-container:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
        }
        
        .laptop-screen {
          transform-origin: bottom center;
          transform: rotateX(-90deg);
          transition: all 0.5s ease-out;
          backface-visibility: hidden;
        }
        
        .laptop-keyboard {
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, #374151, #4b5563);
          border: 2px solid #6b7280;
          transition: all 0.3s ease;
        }

        /* Enhanced Code Animations */
        .code-block {
          background: linear-gradient(135deg, #1f2937, #111827);
          border-radius: 12px;
          padding: 16px;
          font-family: "Fira Code", "Consolas", monospace;
          border: 1px solid rgba(16, 185, 129, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .code-block::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
          animation: codeShine 3s infinite;
        }
        
        @keyframes codeShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .code-line {
          color: #e5e7eb;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          border-right: 2px solid #10b981;
          animation: typing 0.8s steps(40, end) forwards, blink-caret 1s step-end infinite;
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #10b981; }
        }

        /* Enhanced Card Effects */
        .component-card {
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .component-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        .component-card:hover::before {
          transform: translateX(100%);
        }
        
        .component-card:hover {
          transform: translateY(-15px) rotateX(10deg) rotateY(5deg) scale(1.02);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }

        /* Floating Animations */
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-element:nth-child(2n) {
          animation-delay: -2s;
        }
        
        .floating-element:nth-child(3n) {
          animation-delay: -4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }

        /* Glass Morphism */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Neon Effects */
        .neon-glow {
          text-shadow: 
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 20px currentColor,
            0 0 40px currentColor;
        }

        /* Enhanced Mobile Menu */
        .mobile-menu {
          backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.9);
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #f59e0b, #8b5cf6);
          transform-origin: left;
          z-index: 1000;
        }

        /* Enhanced Hover Effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        /* Video Modal Enhancements */
        .video-modal {
          backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.8);
        }
        
        .video-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        /* Stagger Animations */
        .stagger-item {
          opacity: 0;
          transform: translateY(30px) rotateX(-15deg);
          animation: staggerIn 0.8s ease-out forwards;
        }
        
        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .stagger-item:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes staggerIn {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        className="min-h-screen bg-base-200 overflow-x-hidden perspective-2000"
        data-theme="forest"
        ref={containerRef}
      >
        {/* Enhanced Scroll Progress Bar */}
        <motion.div
          className="scroll-indicator fixed top-0 left-0 right-0 h-1 z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Enhanced Navigation */}
        <motion.nav
          className="fixed top-0 w-full z-40 glass border-b border-primary/20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <ShipWheelIcon className="size-6 text-base-100" />
                </div>
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider neon-glow">
                  CodeZynx
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {[
                  { id: "hero", label: "Home", icon: Home },
                  { id: "components", label: "Features", icon: Settings },
                  { id: "about", label: "About", icon: Info },
                  { id: "contact", label: "Contact", icon: Contact },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-primary/20 text-primary"
                        : "text-base-content/70 hover:text-primary hover:bg-primary/10"
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {/* Mode Toggle */}
                <div className="tabs tabs-boxed bg-base-200/50 backdrop-blur-sm">
                  <button className={`tab ${isScrollMode ? "tab-active" : ""}`} onClick={() => setIsScrollMode(true)}>
                    Scroll Mode
                  </button>
                  <button className={`tab ${!isScrollMode ? "tab-active" : ""}`} onClick={() => setIsScrollMode(false)}>
                    Click Mode
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden btn btn-ghost btn-circle"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="size-6" />
                </button>

                <motion.button
                  className="hidden md:flex btn btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden mobile-menu absolute top-full left-0 right-0 p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  {[
                    { id: "hero", label: "Home", icon: Home },
                    { id: "components", label: "Features", icon: Settings },
                    { id: "about", label: "About", icon: Info },
                    { id: "contact", label: "Contact", icon: Contact },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg text-left hover:bg-primary/10 transition-colors"
                    >
                      <item.icon className="size-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Enhanced Hero Section with 3D Elements */}
        <section
          id="hero"
          className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
          ref={heroRef}
        >
          {/* 3D Background Scene */}
          <div className="absolute inset-0 opacity-30">
            <Suspense fallback={<div className="loading-shimmer w-full h-full" />}>
              <Scene3D />
            </Suspense>
          </div>

          {/* Enhanced Parallax Background Layers */}
          <motion.div className="absolute inset-0 parallax-bg-1" style={{ y }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fillOpacity=%220.05%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat opacity-30"></div>
            </div>
          </motion.div>

          <motion.div className="absolute inset-0 parallax-bg-2" style={{ y: parallaxY }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-primary/5 to-secondary/5 opacity-50"></div>
          </motion.div>

          <motion.div className="absolute inset-0 parallax-bg-3" style={{ y: parallaxY2 }}>
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 via-accent/5 to-primary/5 opacity-30"></div>
          </motion.div>

          {/* Floating Elements */}
          {[Database, Globe, Shield, Monitor, Cpu, Code, Brain, Target].map((Icon, index) => (
            <motion.div
              key={index}
              className="floating-element absolute opacity-20"
              style={{
                left: `${10 + ((index * 12) % 80)}%`,
                top: `${20 + ((index * 15) % 60)}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + index,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.5,
              }}
            >
              <Icon className="size-12 text-primary" />
            </motion.div>
          ))}

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent neon-glow reveal-text"
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                CodeZynx
              </motion.h1>

              <motion.p
                className="text-2xl md:text-3xl text-base-content/80 mb-8 leading-relaxed reveal-text"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your Complete Developer Ecosystem
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button
                  className="btn btn-primary btn-lg text-lg px-8 relative overflow-hidden group"
                  onClick={() => scrollToSection("components")}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="size-5 relative z-10" />
                  <span className="relative z-10">Explore Features</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>

                <motion.button
                  className="btn btn-outline btn-lg text-lg px-8"
                  onClick={() => openVideoModal("/placeholder.svg?height=600&width=800")}
                  whileHover={{ scale: 1.05, borderColor: "hsl(var(--s))", y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="size-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Enhanced Scroll Indicator */}
              <motion.div
                className="flex flex-col items-center gap-2 text-base-content/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <span className="text-sm">Scroll to see magic</span>
                <ChevronDown className="size-6" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Components Showcase */}
        <section id="components" className="py-20 bg-base-100 relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16 sr-reveal"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary reveal-text">
                Powerful Tools for Developers
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto reveal-text">
                Discover our comprehensive suite of tools designed to enhance every aspect of your development journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trail.map((style, index) => {
                const component = components[index]
                return (
                  <animated.div key={component.id} style={style}>
                    <InteractiveCard3D index={index}>
                      <ComponentCard component={component} index={index} onVideoClick={openVideoModal} />
                    </InteractiveCard3D>
                  </animated.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Interactive Demo Section */}
        <section id="demo" className="py-20 bg-gradient-to-br from-base-200 to-base-300 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-base-content sr-reveal reveal-text">See It In Action</h2>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto sr-reveal reveal-text">
                Watch how our tools work together to create the perfect development environment
              </p>
            </motion.div>

            {/* Enhanced Laptops with 3D Effects */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {components.slice(0, 3).map((component, index) => (
                <motion.div
                  key={component.id}
                  ref={(el) => (laptopRefs.current[index] = el)}
                  className="laptop-container perspective-1000 cursor-pointer"
                  onClick={() => openVideoModal(component.videoUrl)}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <div className="laptop-keyboard w-full h-8 bg-gradient-to-r from-base-300 to-base-400 rounded-b-xl shadow-lg"></div>
                    <div className="laptop-screen w-full h-48 bg-gradient-to-br from-base-100 to-base-200 rounded-t-xl shadow-2xl transform-gpu border-2 border-base-300">
                      <div className="w-full h-full bg-base-100 m-2 rounded-t-lg overflow-hidden">
                        <div className="p-4 h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="code-block bg-base-200 rounded p-3 flex-1 font-mono text-xs">
                            {component.demoCode.split("\n").map((line, lineIndex) => (
                              <div key={lineIndex} className="code-line text-base-content/80 mb-1">
                                {line}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center mt-2">
                            <component.icon className={`size-8 text-${component.color}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Demo Video */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-base-100 border border-primary/20 hover-lift">
                <div
                  className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer"
                  onClick={() => openVideoModal("/placeholder.svg?height=600&width=800")}
                >
                  <motion.div className="text-center space-y-6" whileHover={{ scale: 1.05 }}>
                    <motion.button
                      className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="size-12 text-base-100" />
                    </motion.button>
                    <div>
                      <h3 className="text-2xl font-bold text-base-content mb-2">Interactive Platform Demo</h3>
                      <p className="text-base-content/60">Experience the full power of CodeZynx</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced About Section */}
        <section id="about" className="py-20 bg-base-100 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary reveal-text">
                About CodeZynx
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto reveal-text">
                Empowering developers worldwide with cutting-edge tools and comprehensive learning resources
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-base-content reveal-text">Our Mission</h3>
                  <p className="text-lg text-base-content/80 leading-relaxed reveal-text">
                    At CodeZynx, we believe that every developer deserves access to world-class tools and resources. Our
                    mission is to democratize software development education and provide a comprehensive ecosystem that
                    supports developers at every stage of their journey.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Award,
                      title: "Excellence",
                      desc: "We strive for excellence in everything we build, ensuring top-quality tools and resources.",
                      color: "primary",
                    },
                    {
                      icon: Heart,
                      title: "Community",
                      desc: "Building a supportive community where developers can learn, share, and grow together.",
                      color: "secondary",
                    },
                    {
                      icon: Zap,
                      title: "Innovation",
                      desc: "Constantly innovating and adopting the latest technologies to stay ahead of the curve.",
                      color: "accent",
                    },
                    {
                      icon: Target,
                      title: "Impact",
                      desc: "Making a meaningful impact on developers' careers and the tech industry as a whole.",
                      color: "primary",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 stagger-item"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className={`p-3 rounded-lg bg-${item.color}/20`}>
                        <item.icon className={`size-6 text-${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base-content mb-2">{item.title}</h4>
                        <p className="text-sm text-base-content/70">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center space-y-8">
                      <div className="grid grid-cols-3 gap-4">
                        {[Code, Users, Globe, Database, Shield, Brain].map((Icon, index) => (
                          <motion.div
                            key={index}
                            className="p-4 rounded-xl glass"
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 5, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 3 + index * 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: index * 0.2,
                            }}
                          >
                            <Icon className="size-8 text-primary" />
                          </motion.div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <motion.h3
                          className="text-2xl font-bold text-base-content"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          50,000+
                        </motion.h3>
                        <p className="text-base-content/70">Developers Empowered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-base-200 to-base-300 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary reveal-text">
                Get In Touch
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto reveal-text">
                Have questions or want to collaborate? We'd love to hear from you!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email Us",
                      details: ["hello@codezynx.com", "support@codezynx.com"],
                      color: "primary",
                    },
                    {
                      icon: Phone,
                      title: "Call Us",
                      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM EST"],
                      color: "secondary",
                    },
                    {
                      icon: MapPin,
                      title: "Visit Us",
                      details: ["123 Tech Street", "San Francisco, CA 94105"],
                      color: "accent",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 stagger-item"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className={`p-3 rounded-lg bg-${item.color}/20`}>
                        <item.icon className={`size-6 text-${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base-content mb-2">{item.title}</h4>
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-base-content/70">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4">
                  {[
                    { icon: Globe, label: "Website" },
                    { icon: Mail, label: "Email" },
                    { icon: Users, label: "Community" },
                  ].map((social, index) => (
                    <motion.button
                      key={index}
                      className="p-3 rounded-lg glass hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="size-6 text-primary" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="glass rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-base-content mb-6">Send us a message</h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">First Name</label>
                        <input
                          type="text"
                          className="input input-bordered w-full focus:input-primary glass"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">Last Name</label>
                        <input
                          type="text"
                          className="input input-bordered w-full focus:input-primary glass"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">Email</label>
                      <input
                        type="email"
                        className="input input-bordered w-full focus:input-primary glass"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">Subject</label>
                      <input
                        type="text"
                        className="input input-bordered w-full focus:input-primary glass"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">Message</label>
                      <textarea
                        className="textarea textarea-bordered w-full h-32 focus:textarea-primary glass"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary w-full"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="size-5" />
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0">
            {[Code, Database, Globe, Shield, Monitor, Cpu, Brain, Target].map((Icon, index) => (
              <div
                key={index}
                ref={(el) => (iconRefs.current[index] = el)}
                className="absolute opacity-10"
                style={{
                  left: `${10 + ((index * 12) % 80)}%`,
                  top: `${20 + ((index * 15) % 60)}%`,
                }}
              >
                <Icon className="size-16 text-primary" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto sr-reveal"
            >
              <h2 className="text-4xl font-bold mb-6 text-base-content reveal-text">
                Ready to Transform Your Coding Journey?
              </h2>
              <p className="text-xl text-base-content/70 mb-8 reveal-text">
                Join thousands of developers who are already using CodeZynx to accelerate their careers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="btn btn-primary btn-lg text-lg px-8"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                    y: -5,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target className="size-5" />
                  Start Free Trial
                </motion.button>
                <motion.button
                  className="btn btn-outline btn-lg text-lg px-8"
                  whileHover={{
                    scale: 1.05,
                    borderColor: "hsl(var(--s))",
                    y: -5,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="size-5" />
                  View Documentation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Video Modal */}
        <AnimatePresence>
          {isVideoModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center video-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
            >
              <motion.div
                className="video-container glass max-w-4xl w-full mx-4 relative"
                initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 btn btn-circle btn-sm glass z-10"
                  onClick={() => setIsVideoModalOpen(false)}
                >
                  <X className="size-4" />
                </button>

                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                  <img
                    src={isVideoModalOpen || "/placeholder.svg"}
                    alt="Demo Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <motion.div
                      className="text-center space-y-4"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Play className="size-8 text-base-100" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Demo Video</h3>
                        <p className="text-white/80">Experience the full power of CodeZynx platform</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// Enhanced Component Card with 3D Effects
const ComponentCard = ({ component, index, onVideoClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const iconRef = useRef(null)

  const springProps = useSpring({
    transform: isHovered
      ? "translateY(-15px) rotateX(10deg) rotateY(5deg) scale(1.03)"
      : "translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)",
    boxShadow: isHovered ? "0 30px 60px rgba(0, 0, 0, 0.2)" : "0 10px 25px rgba(0, 0, 0, 0.1)",
    config: { tension: 300, friction: 30 },
  })

  const iconSpring = useSpring({
    transform: isHovered ? "scale(1.3) rotate(15deg)" : "scale(1) rotate(0deg)",
    config: { tension: 400, friction: 30 },
  })

  useEffect(() => {
    if (cardRef.current && iconRef.current) {
      // Enhanced card flip animation
      gsap.fromTo(
        cardRef.current,
        { rotationY: -90, opacity: 0, z: -100 },
        {
          rotationY: 0,
          opacity: 1,
          z: 0,
          duration: 1.2,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Enhanced icon animation
      gsap.fromTo(
        iconRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.1 + 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [index])

  return (
    <animated.div
      ref={cardRef}
      style={springProps}
      className="component-card glass rounded-2xl p-6 border border-primary/10 relative overflow-hidden group cursor-pointer preserve-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${component.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <animated.div
            ref={iconRef}
            style={iconSpring}
            className={`p-3 rounded-xl bg-${component.color}/20 group-hover:bg-${component.color}/30 transition-colors duration-300`}
          >
            <component.icon className={`size-8 text-${component.color}`} />
          </animated.div>
          <h3 className="text-xl font-bold text-base-content">{component.title}</h3>
        </div>

        <p className="text-base-content/70 mb-6 leading-relaxed">{component.description}</p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {component.features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <div className={`w-2 h-2 rounded-full bg-${component.color}`}></div>
              <span className="text-sm text-base-content/80">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Code Preview */}
        <div className="code-block bg-base-200 rounded-lg p-3 mb-4 font-mono text-xs overflow-hidden">
          {component.demoCode.split("\n").map((line, lineIndex) => (
            <div key={lineIndex} className="code-line text-base-content/70 mb-1 whitespace-nowrap overflow-hidden">
              {line}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            className={`btn btn-${component.color} btn-sm flex-1`}
            onClick={() => onVideoClick(component.videoUrl)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="size-4" />
            Watch Demo
          </motion.button>
          <motion.button
            className="btn btn-outline btn-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight className="size-4" />
          </motion.button>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(3)].map((_, particleIndex) => (
        <motion.div
          key={particleIndex}
          className={`absolute w-2 h-2 bg-${component.color}/30 rounded-full`}
          style={{
            top: `${20 + particleIndex * 30}%`,
            right: `${10 + particleIndex * 5}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2 + particleIndex,
            repeat: Number.POSITIVE_INFINITY,
            delay: particleIndex * 0.5,
          }}
        />
      ))}
    </animated.div>
  )
}

export default LandingPage
