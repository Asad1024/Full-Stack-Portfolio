'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'
import ImageUpload from './ImageUpload'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category?: string
  display_order?: number
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  otherImages?: string[]
  role?: string
  featured: boolean
}

interface ProjectCategory {
  id: string
  name: string
  display_order: number
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: 'Original',
    displayOrder: 0,
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    otherImages: [] as string[],
    role: '',
    featured: false,
  })

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await authFetch('/api/admin/project-categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data || [])
      }
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

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
            category: p.category || 'Original',
            display_order: p.display_order ?? 0,
            githubUrl: p.github_url || p.githubUrl,
            liveUrl: p.live_url || p.liveUrl,
            imageUrl: p.image_url || p.imageUrl,
            otherImages: p.otherImages || [],
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
      const otherImages = Array.isArray(formData.otherImages)
        ? formData.otherImages.filter(Boolean)
        : []
      const projectData = {
        ...formData,
        technologies,
        otherImages,
        displayOrder: formData.displayOrder,
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
          category: 'Original',
          displayOrder: 0,
          githubUrl: '',
          liveUrl: '',
          imageUrl: '',
          otherImages: [],
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
    const other = project.otherImages && Array.isArray(project.otherImages) ? project.otherImages : []
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      category: project.category || 'Original',
      displayOrder: project.display_order ?? 0,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || '',
      otherImages: other,
      role: project.role || '',
      featured: project.featured,
    })
    setIsModalOpen(true)
  }

  const handleMove = async (project: Project, direction: 'up' | 'down') => {
    const sorted = [...projects].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    const idx = sorted.findIndex((p) => p.id === project.id)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const target = sorted[targetIdx]
    try {
      const response = await authFetch('/api/admin/projects', {
        method: 'PATCH',
        body: JSON.stringify({
          updates: [
            { id: project.id, displayOrder: target.display_order ?? 0 },
            { id: target.id, displayOrder: project.display_order ?? 0 },
          ],
        }),
      })
      if (response.ok) fetchProjects()
    } catch (e) {
      console.error('Error reordering:', e)
    }
  }

  const sortedProjects = [...projects].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black">Projects</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage projects shown on the Projects page</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProject(null)
            const maxOrder = Math.max(...projects.map((p) => p.display_order ?? 0), -1)
            setFormData({
              title: '',
              description: '',
              technologies: '',
              category: 'Original',
              displayOrder: maxOrder + 1,
              githubUrl: '',
              liveUrl: '',
              imageUrl: '',
              otherImages: [],
              role: '',
              featured: false,
            })
            setIsModalOpen(true)
          }}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto shrink-0"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedProjects.map((project, index) => (
          <div
            key={project.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col overflow-hidden"
          >
            <div className="p-4 md:p-5 pb-2 flex items-start justify-between gap-3">
              <h3 className="font-semibold text-black text-base md:text-lg truncate flex-1 min-w-0 pt-0.5">
                {project.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="px-4 md:px-5 py-2 flex-1 min-h-0">
              <p className="text-sm text-gray-500 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.category && (
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded">{project.category}</span>
                )}
                {project.featured && (
                  <span className="px-2 py-0.5 bg-black text-white text-xs rounded">Featured</span>
                )}
              </div>
            </div>
            <div className="px-4 md:px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-400">Order: {project.display_order ?? 0}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleMove(project, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(project, 'down')}
                  disabled={index === sortedProjects.length - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 px-6 text-center">
          <p className="text-gray-500">No projects yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Project&quot; to get started.</p>
        </div>
      )}

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
                <label className="block text-sm font-medium text-black mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  ) : (
                    <option value="Original">Original</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Manage categories in Project Categories.</p>
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
                label="Thumbnail image"
                placeholder="Enter image URL or upload a file"
              />

              <div>
                <label className="block text-sm font-medium text-black mb-2">Other images</label>
                <p className="text-xs text-gray-500 mb-2">Upload or paste URL for each image. Shown under the live link in the project modal.</p>
                <div className="space-y-4">
                  {(formData.otherImages.length ? formData.otherImages : ['']).map((url, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 min-w-0">
                        <ImageUpload
                          value={url}
                          onChange={(newUrl) => {
                            const next = [...formData.otherImages]
                            if (i >= next.length) next.push(newUrl)
                            else next[i] = newUrl
                            setFormData({ ...formData, otherImages: next })
                          }}
                          folder="projects"
                          label={i === 0 ? 'Image 1' : `Image ${i + 1}`}
                          placeholder="Enter image URL or upload a file"
                          inputId={`other-image-${i}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.otherImages.filter((_, j) => j !== i)
                          setFormData({ ...formData, otherImages: next })
                        }}
                        className="mt-8 px-3 py-2 border border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, otherImages: [...formData.otherImages, ''] })}
                  className="mt-2 flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-black text-sm"
                >
                  <Plus size={18} />
                  Add another image
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Display order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Use arrows on cards to reorder.</p>
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
