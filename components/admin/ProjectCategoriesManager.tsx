'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'

interface ProjectCategory {
  id: string
  name: string
  display_order: number
}

const ProjectCategoriesManager = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null)
  const [formData, setFormData] = useState({ name: '', displayOrder: 0 })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await authFetch('/api/admin/project-categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
        alert(`Failed to load categories (${response.status}): ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching project categories:', error)
      alert('Network error loading project categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = '/api/admin/project-categories'
      const method = editingCategory ? 'PUT' : 'POST'
      const body = editingCategory
        ? { ...formData, id: editingCategory.id, oldName: editingCategory.name }
        : formData

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchCategories()
        setIsModalOpen(false)
        setEditingCategory(null)
        setFormData({ name: '', displayOrder: 0 })
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to save: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving project category:', error)
      alert('Error saving project category')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Projects using this category will be set to "Original".`)) return

    try {
      const response = await authFetch(`/api/admin/project-categories?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to delete: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting project category:', error)
      alert('Error deleting project category')
    }
  }

  const handleEdit = (category: ProjectCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      displayOrder: category.display_order,
    })
    setIsModalOpen(true)
  }

  const handleMoveOrder = async (category: ProjectCategory, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex((c) => c.id === category.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= categories.length) return

    const target = categories[newIndex]

    try {
      await authFetch('/api/admin/project-categories', {
        method: 'PUT',
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          displayOrder: target.display_order,
        }),
      })
      await authFetch('/api/admin/project-categories', {
        method: 'PUT',
        body: JSON.stringify({
          id: target.id,
          name: target.name,
          displayOrder: category.display_order,
        }),
      })
      fetchCategories()
    } catch (error) {
      console.error('Error moving order:', error)
      alert('Error updating order')
    }
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Categories</h2>
          <p className="text-gray-600 mt-1 text-sm">Clone, Original, Landing Page, etc. — used to filter projects</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', displayOrder: categories.length })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Order</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">Name</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-600">
                  No categories found. Add your first category.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{category.display_order}</span>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveOrder(category, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(category, 'down')}
                          disabled={index === categories.length - 1}
                          className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-black">{category.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-black hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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
                {editingCategory ? 'Edit Category' : 'Add Category'}
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
                <label className="block text-sm font-medium text-black mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="e.g., Clone, Original, Landing Page"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used to filter projects on the Projects page.
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
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
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

export default ProjectCategoriesManager
