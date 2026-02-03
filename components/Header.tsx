'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Code2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Your Calendly booking link. Set NEXT_PUBLIC_CALENDLY_URL in .env.local (e.g. https://calendly.com/yourname/30min)
const BOOK_MEETING_HREF = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'Projects', href: '/projects' },
    { name: 'Services', href: '/services' },
    { name: 'Journey', href: '/journey' },
  ]

  const bookMeetingButton = (
    <Link
      href={BOOK_MEETING_HREF}
      target={BOOK_MEETING_HREF.startsWith('http') ? '_blank' : undefined}
      rel={BOOK_MEETING_HREF.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <Calendar size={16} className="shrink-0" strokeWidth={2} />
      Book a meeting
    </Link>
  )

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 pl-4 text-black dark:text-white hover:opacity-80 transition-opacity">
            <span className="text-sm md:text-base font-semibold">Asad</span>
            <Code2
              size={26}
              className="text-black dark:text-white shrink-0"
              strokeWidth={1.5}
              style={{
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                filter: 'drop-shadow(0 0 0.5px rgba(0,0,0,0.1))',
              }}
            />
          </Link>

          {/* Desktop: nav links + Book meeting */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-black hover:text-gray-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
            {bookMeetingButton}
          </div>

          {/* Mobile: menu toggle (and CTA in menu) */}
          <div className="flex md:hidden items-center gap-3">
            {bookMeetingButton}
            <button
              type="button"
              className="p-2 text-black rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-1 pb-4"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-1 text-sm font-medium text-black hover:text-gray-600 transition-colors border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3">
                <Link
                  href={BOOK_MEETING_HREF}
                  target={BOOK_MEETING_HREF.startsWith('http') ? '_blank' : undefined}
                  rel={BOOK_MEETING_HREF.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar size={18} />
                  Book a meeting
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header
