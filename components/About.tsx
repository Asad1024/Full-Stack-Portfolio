'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About Me',
    content: 'Experienced Full Stack Developer with a passion for creating innovative digital solutions.',
    image: null,
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('/api/about')
        if (response.ok) {
          const data = await response.json()
          if (data) setAboutData(data)
        }
      } catch (error) {
        console.error('Error fetching about:', error)
      }
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data?.imageUrl) setProfileImage(data.imageUrl)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchAbout()
    fetchProfile()
  }, [])

  // Split content into paragraphs
  const paragraphs = aboutData.content ? aboutData.content.split('\n').filter(p => p.trim()) : []

  return (
    <section id="about" className="relative py-8 lg:py-10 bg-white dark:bg-zinc-950 overflow-hidden">

      <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          {/* Left Side - Image */}
          {profileImage && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full">
                <img
                  src={profileImage}
                  alt={aboutData.title}
                  className="w-full h-auto object-cover rounded-lg grayscale"
                />
              </div>
            </motion.div>
          )}

          {/* Right Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Section Label */}
            <div>
              <span className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                About
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                I think in systems.
              </motion.h2>
              <motion.h3
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-600 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                I build for the long term.
              </motion.h3>
            </div>

            {/* Content Paragraphs with AI Highlights */}
            <div className="space-y-4">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-base md:text-lg text-gray-700 leading-relaxed relative"
                  >
                    {paragraph}
                  </motion.p>
                ))
              ) : (
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {aboutData.content}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
