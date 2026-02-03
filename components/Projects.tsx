'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProjectModal from './ProjectModal'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category?: string
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  otherImages?: string[]
  role?: string
  publishedDate?: string
  mapUrl?: string
  featured: boolean
}

interface ProjectsProps {
  featuredOnly?: boolean
  compact?: boolean
  pageLayout?: boolean
}

interface ProjectCategory {
  id: string
  name: string
  display_order: number
}

const Projects = ({ featuredOnly = false, compact = false, pageLayout = false }: ProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = featuredOnly ? '/api/projects?featured=true' : '/api/projects'
        const projectsResponse = await fetch(url)
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/project-categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data || [])
        }
      } catch (e) {
        console.error('Error fetching categories:', e)
      }
    }
    fetchCategories()
  }, [])

  const filterCategories = ['All', ...categories.map((c) => c.name)]

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => (p.category || 'Original') === filter)

  return (
    <section
      id="projects"
      className={`relative overflow-hidden ${
        pageLayout ? 'py-16 lg:py-24 bg-transparent' : 'py-8 lg:py-10 bg-white dark:bg-zinc-950'
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {!compact && (
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-black mb-4 relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {featuredOnly ? 'Featured Projects' : 'My Work'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
              >
                {featuredOnly
                  ? 'A collection of projects showcasing my expertise in full stack development'
                  : 'A complete collection of my projects'}
              </motion.p>
              {featuredOnly && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center mt-4"
                >
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
                  >
                    View all projects
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </div>
          )}

          {/* Filter by category - only on full projects page */}
          {!featuredOnly && filterCategories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-14">
              {filterCategories.map((cat) => {
                const isActive = (filter === 'all' && cat === 'All') || (filter !== 'all' && filter === cat)
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat === 'All' ? 'all' : cat)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white/80 text-zinc-600 hover:text-black hover:bg-white border border-zinc-200/80 hover:border-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {/* Projects Grid */}
          <div
            className={`grid gap-6 max-w-7xl mx-auto ${
              pageLayout
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            }`}
          >
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
                onClick={() => {
                  setSelectedProject(project)
                  setIsModalOpen(true)
                }}
                className={`group relative bg-white overflow-hidden cursor-pointer rounded-xl transition-all duration-300 ${
                  pageLayout
                    ? 'border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-zinc-300 hover:-translate-y-1'
                    : 'border border-gray-200 hover:border-black hover:shadow-2xl rounded-2xl transform hover:-translate-y-2'
                }`}
              >
                {/* Project thumbnail */}
                {project.imageUrl && (
                  <div className={`relative overflow-hidden bg-zinc-100 ${pageLayout ? 'aspect-[16/10]' : 'h-40'}`}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {project.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-black rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                {/* Card Content */}
                <div className={pageLayout ? 'p-5' : 'p-4'}>
                  <h3 className="font-bold text-black line-clamp-1 group-hover:text-zinc-700 transition-colors text-base">
                    {project.title}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2 mt-1.5 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] font-medium text-zinc-500 bg-zinc-100 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-black group-hover:gap-2 transition-all">
                    View project
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500">No projects match this filter.</p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-4 text-sm font-medium text-black hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProject(null)
        }}
      />
    </section>
  )
}

export default Projects
