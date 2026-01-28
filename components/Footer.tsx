'use client'

import { useEffect, useState } from 'react'
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

  return (
    <footer className="bg-black dark:bg-zinc-950 text-white py-12 border-t border-zinc-800">
      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 mb-0">
            © {currentYear} <span className="text-white font-semibold">Asad</span>. All rights reserved.
          </p>
          {(githubUrl || linkedinUrl) && (
            <div className="flex items-center gap-4 ml-auto">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 border border-white/30 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
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
                  className="p-2.5 border border-white/30 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Linkedin size={20} className="fill-current" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
