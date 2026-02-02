'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [githubUrl, setGithubUrl] = useState<string | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data?.github_url) setGithubUrl(data.github_url)
          if (data?.linkedin_url) setLinkedinUrl(data.linkedin_url)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [])

  const links = [
    { label: 'Home', href: '/#home' },
    { label: 'Services', href: '/services' },
    { label: 'Journey', href: '/journey' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <footer className="bg-zinc-950 text-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24 py-14 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity w-fit"
            >
              Asad
            </Link>
            <nav
              className="flex flex-wrap items-center gap-6 sm:gap-8"
              aria-label="Footer navigation"
            >
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-zinc-800" />

          {/* Bottom: tagline + social + copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-sm text-zinc-500 order-2 sm:order-1">
              Full-stack development & digital solutions.
            </p>
            <div className="flex items-center gap-6 order-1 sm:order-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Github size={20} className="fill-current" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <Linkedin size={20} className="fill-current" />
                </a>
              )}
            </div>
          </div>

          <p className="mt-8 text-xs text-zinc-600">
            © {currentYear} Asad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
