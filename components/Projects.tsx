'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectModal from './ProjectModal'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  demoVideoUrl?: string
  role?: string
  publishedDate?: string
  mapUrl?: string
  featured: boolean
}

interface ProjectFilter {
  id: string
  name: string
  display_order: number
  is_active: boolean
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filters, setFilters] = useState<ProjectFilter[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData)
        }

        // Fetch filter categories
        const filtersResponse = await fetch('/api/project-filters')
        if (filtersResponse.ok) {
          const filtersData = await filtersResponse.json()
          setFilters(filtersData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter((p) => p.technologies.some((t) => t.toLowerCase().includes(filter.toLowerCase())))

  return (
    <section id="projects" className="relative py-8 lg:py-10 bg-white dark:bg-zinc-950 overflow-hidden">

      <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-black mb-4 relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Projects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            >
              A collection of projects showcasing my expertise in full stack development
            </motion.p>
          </div>

          {/* Filter */}
          {filters.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((filterItem) => (
                <button
                  key={filterItem.id}
                  onClick={() => setFilter(filterItem.name.toLowerCase() === 'all' ? 'all' : filterItem.name)}
                  className={`px-5 py-2 text-xs font-medium transition-colors rounded-md ${
                    (filter === 'all' && filterItem.name.toLowerCase() === 'all') ||
                    (filter !== 'all' && filter === filterItem.name)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {filterItem.name}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => {
                  setSelectedProject(project)
                  setIsModalOpen(true)
                }}
                className="group relative bg-white border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer rounded-2xl transform hover:-translate-y-2"
              >

                {/* Project Image or Video */}
                {(project.imageUrl || project.demoVideoUrl) && (
                  <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {project.demoVideoUrl ? (
                      <div className="relative w-full h-full">
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
                    ) : project.imageUrl ? (
                      <>
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </>
                    ) : null}
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg z-10">
                        ⭐ Featured
                      </div>
                    )}
                    
                    {/* Hover Overlay with View Details */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <div className="bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        View Project →
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Card Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-black mb-1.5 line-clamp-1 group-hover:text-gray-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        whileHover={{ scale: 1.05 }}
                        className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-lg">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProject(project)
                      setIsModalOpen(true)
                    }}
                    className="w-full text-center py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
                  >
                    Explore Project
                  </button>
                </div>
                
                {/* Decorative Corner Element */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-black/5 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-center text-gray-600 py-12">No projects found.</p>
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
