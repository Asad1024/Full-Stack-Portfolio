'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'

interface ProjectFilter {
  id: string
  name: string
  display_order: number
  is_active: boolean
}

const ProjectFiltersManager = () => {
  const [filters, setFilters] = useState<ProjectFilter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFilter, setEditingFilter] = useState<ProjectFilter | null>(null)
  const [formData, setFormData] = useState({ name: '', displayOrder: 0, isActive: true })

  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchFilters = async () => {
    try {
      const response = await authFetch('/api/admin/project-filters')
      if (response.ok) {
        const data = await response.json()
        setFilters(data || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
        alert(`Failed to load project filters (${response.status}): ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching project filters:', error)
      alert('Network error loading project filters')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/project-filters'
      const method = editingFilter ? 'PUT' : 'POST'
      const body = editingFilter 
        ? { ...formData, id: editingFilter.id }
        : formData

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchFilters()
        setIsModalOpen(false)
        setEditingFilter(null)
        setFormData({ name: '', displayOrder: 0, isActive: true })
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to save filter: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving project filter:', error)
      alert('Error saving project filter')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this filter? Projects using this filter will still work, but the filter option will be removed.')) return

    try {
      const response = await authFetch(`/api/admin/project-filters?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchFilters()
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to delete filter: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting project filter:', error)
      alert('Error deleting project filter')
    }
  }

  const handleEdit = (filter: ProjectFilter) => {
    setEditingFilter(filter)
    setFormData({
      name: filter.name,
      displayOrder: filter.display_order,
      isActive: filter.is_active,
    })
    setIsModalOpen(true)
  }

  const handleMoveOrder = async (filter: ProjectFilter, direction: 'up' | 'down') => {
    const currentIndex = filters.findIndex(f => f.id === filter.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= filters.length) return

    const targetFilter = filters[newIndex]
    
    // Swap display orders
    const tempOrder = filter.display_order
    const newOrder = targetFilter.display_order

    try {
      // Update both filters
      await authFetch('/api/admin/project-filters', {
        method: 'PUT',
        body: JSON.stringify({
          id: filter.id,
          name: filter.name,
          displayOrder: newOrder,
          isActive: filter.is_active,
        }),
      })

      await authFetch('/api/admin/project-filters', {
        method: 'PUT',
        body: JSON.stringify({
          id: targetFilter.id,
          name: targetFilter.name,
          displayOrder: tempOrder,
          isActive: targetFilter.is_active,
        }),
      })

      fetchFilters()
    } catch (error) {
      console.error('Error moving filter order:', error)
      alert('Error updating filter order')
    }
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-black">Project Filter Categories</h2>
          <p className="text-gray-600 mt-1">Manage the filter categories shown in the Projects section</p>
        </div>
        <button
          onClick={() => {
            setEditingFilter(null)
            setFormData({ name: '', displayOrder: filters.length, isActive: true })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Add Filter
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Order</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filters.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                  No filters found. Add your first filter category.
                </td>
              </tr>
            ) : (
              filters.map((filter, index) => (
                <tr key={filter.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{filter.display_order}</span>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveOrder(filter, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(filter, 'down')}
                          disabled={index === filters.length - 1}
                          className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-black">{filter.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      filter.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {filter.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(filter)}
                        className="text-black hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(filter.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">
                {editingFilter ? 'Edit Filter' : 'Add Filter'}
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
                <label className="block text-sm font-medium text-black mb-2">Filter Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="e.g., React, Next.js, Full Stack"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name will appear in the filter buttons. It should match technology names used in your projects.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Use the arrow buttons in the table to reorder.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                  />
                  <span className="text-sm font-medium text-black">Active</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive filters won't appear in the public Projects section.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  {editingFilter ? 'Update' : 'Create'}
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

export default ProjectFiltersManager
