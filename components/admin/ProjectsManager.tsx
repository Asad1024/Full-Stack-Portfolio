'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'
import ImageUpload from './ImageUpload'

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
  featured: boolean
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    demoVideoUrl: '',
    role: '',
    featured: false,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await authFetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setProjects(data.map((p: any) => ({
            ...p,
            technologies: Array.isArray(p.technologies) 
              ? p.technologies 
              : p.technologies ? JSON.parse(p.technologies) : [],
            githubUrl: p.github_url || p.githubUrl,
            liveUrl: p.live_url || p.liveUrl,
            imageUrl: p.image_url || p.imageUrl,
            demoVideoUrl: p.demo_video_url || p.demoVideoUrl,
          })))
        } else if (data?.error) {
          console.error('API Error:', data.error, data.details)
          alert(`Failed to load projects: ${data.error}`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
        alert(`Failed to load projects (${response.status}): ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      alert('Network error loading projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const technologies = formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      const projectData = {
        ...formData,
        technologies,
      }

      const url = '/api/admin/projects'
      const method = editingProject ? 'PUT' : 'POST'
      const body = editingProject 
        ? { ...projectData, id: editingProject.id }
        : projectData

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchProjects()
        setIsModalOpen(false)
        setEditingProject(null)
        setFormData({
          title: '',
          description: '',
          technologies: '',
          githubUrl: '',
          liveUrl: '',
          imageUrl: '',
          demoVideoUrl: '',
          role: '',
          featured: false,
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Save error:', response.status, errorData)
        alert(`Failed to ${editingProject ? 'update' : 'create'} project: ${errorData.details || errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await authFetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || '',
      demoVideoUrl: project.demoVideoUrl || '',
      role: project.role || '',
      featured: project.featured,
    })
    setIsModalOpen(true)
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Projects Management</h2>
        <button
          onClick={() => {
            setEditingProject(null)
        setFormData({
          title: '',
          description: '',
          technologies: '',
          githubUrl: '',
          liveUrl: '',
          imageUrl: '',
          demoVideoUrl: '',
          role: '',
          featured: false,
        })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-black">{project.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-black hover:text-gray-600"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-100 text-black text-xs">
                  {tech}
                </span>
              ))}
            </div>
            {project.featured && (
              <span className="inline-block px-2 py-1 bg-black text-white text-xs">Featured</span>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-none"
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">My Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="Full-Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="React, Node.js, PostgreSQL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                />
              </div>

              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="projects"
                label="Project Image"
                placeholder="Enter image URL or upload a file"
              />

              <div>
                <label className="block text-sm font-medium text-black mb-2">Demo Video URL</label>
                <input
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or direct video URL</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-black">
                  Featured Project
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-black px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsManager
