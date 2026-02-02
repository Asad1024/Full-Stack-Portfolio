'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { getServiceIconComponent } from '@/lib/service-icons'

interface Service {
  id: string
  title: string
  description: string
  icon?: string | null
  display_order: number
}

const iconClassName = 'w-10 h-10 shrink-0'
const iconStroke = 1.25

function ServiceIcon({ iconKey }: { iconKey?: string | null }) {
  const Icon = getServiceIconComponent(iconKey)
  if (Icon) return <Icon className={iconClassName} strokeWidth={iconStroke} />
  return <Code2 className={iconClassName} strokeWidth={iconStroke} />
}

/** Parse description: newlines become bullets; lines starting with • or - are stripped. */
function formatServiceDescription(description: string) {
  const lines = description
    .split(/\n/)
    .map((line) => line.replace(/^[\s•\-]+\s?/, '').trim())
    .filter(Boolean)
  return lines
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services')
        if (res.ok) {
          const data = await res.json()
          setServices(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (!selectedService) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedService])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Home
          </Link>
        </div>

        {/* Hero */}
        <header className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24 pb-12 md:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-4">
              What we deliver
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.08]">
              Services
            </h1>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              End-to-end digital solutions — strategy, design, development, and delivery. Built for scale and partnership.
            </p>
          </div>
        </header>

        {/* Services grid — clickable cards */}
        <section className="bg-zinc-50/60 border-t border-zinc-100">
          <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24 py-12 md:py-20">
            <div className="max-w-6xl mx-auto">
              {services.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border-2 border-dashed border-zinc-200 bg-white">
                  <p className="text-zinc-500">No services listed yet.</p>
                  <p className="text-zinc-400 text-sm mt-1">Manage from the admin dashboard.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {services.map((service, index) => (
                    <motion.button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="group text-left w-full rounded-2xl bg-white border border-zinc-200/80 p-6 shadow-sm hover:shadow-lg hover:border-amber-500/30 hover:bg-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center group-hover:bg-amber-600 group-hover:scale-105 transition-all duration-300">
                          <ServiceIcon iconKey={service.icon} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-bold text-black tracking-tight group-hover:text-amber-700 transition-colors">
                            {service.title}
                          </h2>
                          <p className="mt-2 text-sm text-zinc-600 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            View details
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-100 bg-white py-16 md:py-20">
          <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                Let&apos;s work together
              </h2>
              <p className="mt-3 text-zinc-600">
                Have a project in mind? Get in touch.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Contact
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </article>
      <Footer />

      {/* Detail modal */}
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-shrink-0 flex items-start justify-between gap-4 p-6 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center">
                      <ServiceIcon iconKey={selectedService.icon} />
                    </div>
                    <h2 className="text-xl font-bold text-black tracking-tight truncate">
                      {selectedService.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    aria-label="Close"
                    className="flex-shrink-0 p-2 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {formatServiceDescription(selectedService.description).length > 0 ? (
                      <ul className="space-y-3">
                        {formatServiceDescription(selectedService.description).map((line, i) => (
                          <li key={i} className="flex gap-3 text-zinc-600 leading-relaxed">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-600 leading-relaxed">{selectedService.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 p-6 pt-4 border-t border-zinc-100 bg-zinc-50/50">
                  <Link
                    href="/#contact"
                    onClick={() => setSelectedService(null)}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    Contact
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
