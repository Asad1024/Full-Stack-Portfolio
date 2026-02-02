'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { getServiceIconComponent } from '@/lib/service-icons'

interface Service {
  id: string
  title: string
  description: string
  icon?: string | null
  display_order: number
}

function ServiceIconDisplay({ iconKey }: { iconKey?: string | null }) {
  const Icon = getServiceIconComponent(iconKey)
  if (Icon) return <Icon className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  return <Code2 className="w-8 h-8 shrink-0" strokeWidth={1.5} />
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  return (
    <section
      id="services"
      className="relative py-8 lg:py-10 bg-zinc-50 dark:bg-zinc-900 overflow-hidden"
    >
      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-4"
            >
              Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            >
              What I offer — from development to consulting
            </motion.p>
          </div>

          {/* Services grid — card layout, slightly different from Skills */}
          <div className="max-w-6xl mx-auto">
            {services.length === 0 ? (
              <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm py-8">
                No services added yet. Manage content from the admin dashboard.
              </p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group relative p-6 md:p-7 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-black dark:hover:border-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-black dark:bg-white text-white dark:text-black mb-5 group-hover:scale-105 transition-transform duration-300">
                      <ServiceIconDisplay iconKey={service.icon} />
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                      {service.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
