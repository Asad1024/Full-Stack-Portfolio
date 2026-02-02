'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, ExternalLink, Calendar, Github } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  otherImages?: string[]
  featured: boolean
  role?: string
  publishedDate?: string
  mapUrl?: string
}

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [copied, setCopied] = useState(false)

  const thumbnail = project?.imageUrl
  const otherImages = Array.isArray(project?.otherImages) ? project.otherImages : []

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCopyLink = () => {
    if (project?.liveUrl) {
      navigator.clipboard.writeText(project.liveUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!project || !isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-75 z-50"
          />
          
          {/* Modal - Fixed height, no scroll, rounded corners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-y-2 md:inset-y-2.5 lg:inset-y-4.5 inset-x-3 md:inset-x-14 lg:inset-x-20 xl:inset-x-28 bg-gray-200 z-50 overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full w-full flex flex-col bg-white rounded-lg overflow-hidden">
              {/* Header - Fixed */}
              <div className="flex justify-between items-center px-6 py-4 flex-shrink-0">
                <h2 className="text-2xl md:text-3xl font-semibold text-black">{project.title}</h2>
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium transition-colors rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-green-600 text-sm font-medium transition-colors rounded-md"
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-black transition-colors rounded-md"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content - Two columns; left static, right (images) scrolls */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] grid-rows-[auto_1fr] lg:grid-rows-1 gap-0 h-full min-h-0">
                  {/* Left Column - 40% - Static: Role, Description, Skills at bottom */}
                  <div className="p-6 md:p-8 flex flex-col flex-shrink-0 overflow-hidden">
                    <div className="flex flex-col flex-1 min-h-0">
                      {/* Role - static */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          My role. <span className="text-base font-medium text-black">{project.role || 'Full-Stack Developer'}</span>
                        </p>
                      </div>

                      {/* Project Description - static */}
                      <div style={{ marginTop: '4rem' }}>
                        <h3 className="text-lg font-normal text-gray-600 mb-2">Project description.</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">{project.description}</p>
                      </div>

                      {/* Spacer - pushes skills to bottom */}
                      <div className="flex-1 min-h-4" />

                      {/* Published Date */}
                      {project.publishedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
                          <Calendar size={14} />
                          <span>Published on {new Date(project.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}

                      {/* Skills and Deliverables - at bottom */}
                      <div className="mt-auto">
                        <h3 className="text-lg font-normal text-gray-600 mb-2">Skills and deliverables</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1.5 bg-gray-100 text-black text-sm font-medium rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - 60% - Images section scrolls */}
                  <div className="p-6 md:p-8 overflow-y-auto overflow-x-hidden min-h-0">
                    <div className="flex flex-col space-y-4">
                      {/* 1. Thumbnail image at top */}
                      {thumbnail && (
                        <div className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={thumbnail}
                            alt={project.title}
                            className="w-full h-56 md:h-72 lg:h-80 object-cover"
                          />
                        </div>
                      )}

                      {/* 2. Link box */}
                      {project.liveUrl && (
                        <div className="bg-gray-50 border border-gray-300 p-7 rounded-md relative">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <ExternalLink size={20} strokeWidth={1.5} />
                          </a>
                          <div>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 underline text-sm font-semibold block mb-3"
                            >
                              {project.title} Demo
                            </a>
                            <p className="text-xs text-gray-600">
                              {project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Map */}
                      {project.mapUrl && (
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                          <div className="h-40 md:h-44 bg-gray-100 relative">
                            <iframe
                              src={project.mapUrl}
                              className="w-full h-full border-0"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. Other images: below link box, same size as thumbnail; scroll in whole modal to see them */}
                      {otherImages.length > 0 && (
                        <div className="space-y-4">
                          {otherImages.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full rounded-md overflow-hidden border border-gray-200 bg-gray-100 hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 block"
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-56 md:h-72 lg:h-80 object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal
