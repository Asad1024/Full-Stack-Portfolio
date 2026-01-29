'use client'

import { useEffect, useState } from 'react'
import { Github, Linkedin, ArrowUp } from 'lucide-react'

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
    <footer className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="container relative mx-auto px-10 md:px-14 lg:px-20 xl:px-24 py-14">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left order-2 sm:order-1">
            <p className="text-zinc-400 text-sm tracking-wide">
              © {currentYear}{' '}
              <span className="text-white font-semibold tracking-normal">Asad</span>
              . All rights reserved.
            </p>
            <p className="text-zinc-500 text-xs mt-1.5">Crafted with care</p>
          </div>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {(githubUrl || linkedinUrl) && (
              <>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-zinc-900 hover:border-white/20 hover:scale-105 transition-all duration-300"
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
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white hover:text-zinc-900 hover:border-white/20 hover:scale-105 transition-all duration-300"
                  >
                    <Linkedin size={20} className="fill-current" />
                  </a>
                )}
              </>
            )}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 shrink-0"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
