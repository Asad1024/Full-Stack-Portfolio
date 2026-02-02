'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Brain, Sparkles, Code2, Cpu, Terminal, Bot, Layers, Database } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Icons around the perimeter, alternating upper/bottom so no two consecutive on same side
const GLITTER_ITEMS: { Icon: LucideIcon; style: Record<string, string> }[] = [
  { Icon: Brain, style: { top: '2%', left: '2%' } },           // upper
  { Icon: Cpu, style: { bottom: '2%', left: '2%' } },          // bottom
  { Icon: Sparkles, style: { top: '2%', right: '15%' } },      // upper
  { Icon: Terminal, style: { bottom: '2%', right: '20%' } },   // bottom
  { Icon: Code2, style: { top: '2%', right: '2%' } },          // upper
  { Icon: Bot, style: { bottom: '2%', right: '2%' } },         // bottom
  { Icon: Layers, style: { top: '5%', left: '50%', transform: 'translateX(-50%)' } },   // upper
  { Icon: Database, style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' } }, // bottom
]

const FOCUS_AREAS = [
  'AI Product Engineering',
  'Full-Stack Development',
  'Legacy Code Modernization',
  'SaaS Architecture',
  'Generative AI Integration',
]

const STAR_DURATION_MS = 1800

const Hero = () => {
  const [activeStarIndex, setActiveStarIndex] = useState(0)
  const [profileData, setProfileData] = useState({
    name: 'Full Stack Developer',
    title: 'Building Digital Solutions',
    description: 'Creating exceptional web experiences with modern technologies',
    imageUrl: null as string | null,
    github_url: null as string | null,
    linkedin_url: null as string | null,
  })
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data) setProfileData(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStarIndex((i) => (i + 1) % GLITTER_ITEMS.length)
    }, STAR_DURATION_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="home" className="relative pt-12 pb-8 lg:pt-16 lg:pb-10 bg-white overflow-hidden">
      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh]">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl px-4 space-y-2 lg:space-y-3 pt-14 lg:pt-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-left"
            >
              <span className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wider">
                Hello, I&apos;m
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight relative text-left"
            >
              <span className="text-black">{profileData.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-2 flex flex-col items-start text-left"
            >
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                {profileData.title}
              </h2>
              <div className="h-1 w-28 rounded-full bg-gradient-to-r from-black to-gray-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm md:text-base text-gray-700 font-medium text-left"
            >
              {profileData.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2 justify-start"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl"
              >
                <span>View My Work</span>
                <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
              >
                <span>Get In Touch</span>
              </motion.a>
            </motion.div>

            {(profileData.github_url || profileData.linkedin_url) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex items-center justify-center gap-6 pt-6 w-full"
              >
                {profileData.github_url && (
                  <motion.a
                    href={profileData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label="GitHub"
                  >
                    <Github size={22} />
                  </motion.a>
                )}
                {profileData.linkedin_url && (
                  <motion.a
                    href={profileData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group p-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={22} />
                  </motion.a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right side - Focus Areas (Option 1: equal boxes, shadow, hover, blinking stars) */}
          <div className="relative flex items-center justify-center min-h-[320px] lg:min-h-[400px] px-4 lg:px-0">
            {/* Glitter icons - one at a time (star, AI, coding icons) */}
            <AnimatePresence mode="wait">
              {GLITTER_ITEMS.map((item, i) => {
                if (i !== activeStarIndex) return null
                const IconComp = item.Icon
                return (
                  <motion.span
                    key={i}
                    className="absolute pointer-events-none text-black"
                    style={item.style}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <IconComp size={22} strokeWidth={1.5} />
                  </motion.span>
                )
              })}
            </AnimatePresence>
            <div className="w-full max-w-md relative z-10 ml-4 lg:ml-8">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-6">
                Focus Areas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FOCUS_AREAS.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}
                    className="flex items-center justify-center px-3 py-2.5 h-[52px] w-full text-xs font-medium text-gray-800 border-l-4 border-black bg-white shadow-md rounded-sm hover:shadow-lg transition-shadow duration-300 text-center leading-tight"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
