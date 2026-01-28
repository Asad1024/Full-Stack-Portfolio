'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, ExternalLink, ChevronLeft, ChevronRight, Calendar, Github } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  demoVideoUrl?: string
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Get all images for carousel (main image + any additional)
  const images = project?.imageUrl ? [project.imageUrl] : []

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setCurrentImageIndex(0)
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

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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

              {/* Content - Two Column Layout, NO SCROLL */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full grid grid-cols-1 lg:grid-cols-[40%_60%] gap-0">
                  {/* Left Column - 40% - Project Description, Skills and Deliverables */}
                  <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="h-full flex flex-col space-y-5">
                      {/* Role */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          My role. <span className="text-base font-medium text-black">{project.role || 'Full-Stack Developer'}</span>
                        </p>
                      </div>

                      {/* Project Description */}
                      <div className="flex-1 min-h-0" style={{ marginTop: '4rem' }}>
                        <h3 className="text-lg font-normal text-gray-600 mb-2">Project description.</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">{project.description}</p>
                      </div>

                      {/* Skills and Deliverables */}
                      <div>
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

                      {/* Published Date */}
                      {project.publishedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>Published on {new Date(project.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - 60% - Image and Link */}
                  <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="h-full flex flex-col space-y-4">
                      {/* Image Carousel */}
                      {images.length > 0 && (
                        <div className="relative group">
                          <div className="relative w-full h-56 md:h-72 lg:h-80 bg-gray-200 overflow-hidden rounded-md">
                            <img
                              src={images[currentImageIndex]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    prevImage()
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 rounded-full"
                                >
                                  <ChevronLeft size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    nextImage()
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 rounded-full"
                                >
                                  <ChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {images.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setCurrentImageIndex(index)
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Demo Video */}
                      {project.demoVideoUrl && !project.imageUrl && (
                        <div className="relative w-full h-56 md:h-64 bg-gray-200 rounded-md overflow-hidden">
                          {project.demoVideoUrl.includes('youtube.com') || project.demoVideoUrl.includes('youtu.be') ? (
                            <iframe
                              src={project.demoVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : project.demoVideoUrl.includes('vimeo.com') ? (
                            <iframe
                              src={project.demoVideoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                              className="w-full h-full"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={project.demoVideoUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
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

                      {/* Live Project Link */}
                      {project.liveUrl && (
                        <div className="bg-gray-50 border border-gray-300 p-7 mt-auto rounded-md relative">
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
