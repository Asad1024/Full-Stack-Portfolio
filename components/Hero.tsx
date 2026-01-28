'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin } from 'lucide-react'

const Hero = () => {
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

  return (
    <section id="home" className="relative py-8 lg:py-10 bg-white overflow-hidden">

      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto px-4 space-y-2 lg:space-y-3 pt-14 lg:pt-20"
        >
          {/* Greeting - left-aligned to match paragraph start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-left"
          >
            <span className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wider">
              Hello, I'm
            </span>
          </motion.div>

          {/* Name with Animated Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight relative text-left"
          >
            <motion.span
              className="text-black"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {profileData.name}
            </motion.span>
          </motion.h1>

          {/* Title with Animated Underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2 flex flex-col items-start text-left"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
              {profileData.title}
            </h2>
            <div className="h-1 bg-black w-32" />
          </motion.div>

          {/* One Line Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg text-gray-700 font-medium text-left"
          >
            {profileData.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-2 justify-center"
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

          {/* Professional Social Links */}
          {(profileData.github_url || profileData.linkedin_url) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center justify-center gap-6 pt-6"
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
      </div>
    </section>
  )
}

export default Hero
