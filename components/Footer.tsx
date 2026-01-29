'use client'

import { useEffect, useState } from 'react'
import { Github, Linkedin, ArrowUp, Heart } from 'lucide-react'

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Gradient background with depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      {/* Soft radial glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-24 bg-amber-500/5 blur-3xl pointer-events-none" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="container relative mx-auto px-10 md:px-14 lg:px-20 xl:px-24 py-12 md:py-14">
        <div className="flex flex-col gap-8">
          {/* Main row: social + back to top */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 order-2 sm:order-1">
              {(githubUrl || linkedinUrl) && (
                <>
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
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
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <Linkedin size={20} className="fill-current" />
                    </a>
                  )}
                </>
              )}
            </div>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="order-1 sm:order-2 p-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300 shrink-0"
            >
              <ArrowUp size={20} />
            </button>
          </div>
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {/* Copyright row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-zinc-500 text-sm tracking-wide">
              © {currentYear}{' '}
              <span className="text-white font-medium">Asad</span>
              . All rights reserved.
            </p>
            <p className="text-zinc-600 text-xs flex items-center gap-1">
              Crafted with <Heart size={12} className="inline text-amber-500/80 fill-amber-500/40" /> and care
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
