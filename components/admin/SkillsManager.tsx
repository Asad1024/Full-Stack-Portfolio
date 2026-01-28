'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'
import ImageUpload from './ImageUpload'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  imageUrl?: string
  category_order?: number
  skill_order?: number
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({ name: '', category: '', proficiency: 80, imageUrl: '', categoryOrder: 0, skillOrder: 0 })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await authFetch('/api/admin/skills')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setSkills(data.map((s: any) => ({
            ...s,
            imageUrl: s.image_url || s.imageUrl,
            category_order: s.category_order || 0,
            skill_order: s.skill_order || 0,
          })))
        } else if (data?.error) {
          console.error('API Error:', data.error, data.details)
          alert(`Failed to load skills: ${data.error}`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
        alert(`Failed to load skills (${response.status}): ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
      alert('Network error loading skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/skills'
      const method = editingSkill ? 'PUT' : 'POST'
      const body = editingSkill 
        ? { ...formData, id: editingSkill.id }
        : formData

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchSkills()
        setIsModalOpen(false)
        setEditingSkill(null)
        setFormData({ name: '', category: '', proficiency: 80, imageUrl: '', categoryOrder: 0, skillOrder: 0 })
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await authFetch(`/api/admin/skills?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      imageUrl: skill.imageUrl || '',
      categoryOrder: skill.category_order || 0,
      skillOrder: skill.skill_order || 0,
    })
    setIsModalOpen(true)
  }

  const handleMoveCategory = async (category: string, direction: 'up' | 'down') => {
    const categorySkills = skills.filter(s => s.category === category)
    if (categorySkills.length === 0) return

    const currentOrder = categorySkills[0].category_order || 0
    const allCategories = [...new Set(skills.map(s => s.category))]
    const categoryIndex = allCategories.findIndex(c => c === category)
    
    if (categoryIndex === -1) return

    const targetIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1
    if (targetIndex < 0 || targetIndex >= allCategories.length) return

    const targetCategory = allCategories[targetIndex]
    const targetCategorySkills = skills.filter(s => s.category === targetCategory)
    const targetOrder = targetCategorySkills[0]?.category_order || 0

    // Swap orders
    const updates = [
      ...categorySkills.map(s => ({ id: s.id, categoryOrder: targetOrder })),
      ...targetCategorySkills.map(s => ({ id: s.id, categoryOrder: currentOrder })),
    ]

    try {
      const response = await authFetch('/api/admin/skills', {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
      })

      if (response.ok) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error moving category:', error)
      alert('Error updating category order')
    }
  }

  const handleMoveSkill = async (skill: Skill, direction: 'up' | 'down') => {
    const categorySkills = skills
      .filter(s => s.category === skill.category)
      .sort((a, b) => (a.skill_order || 0) - (b.skill_order || 0))
    
    const skillIndex = categorySkills.findIndex(s => s.id === skill.id)
    if (skillIndex === -1) return

    const targetIndex = direction === 'up' ? skillIndex - 1 : skillIndex + 1
    if (targetIndex < 0 || targetIndex >= categorySkills.length) return

    const targetSkill = categorySkills[targetIndex]
    const currentOrder = skill.skill_order || 0
    const targetOrder = targetSkill.skill_order || 0

    // Swap orders
    const updates = [
      { id: skill.id, skillOrder: targetOrder },
      { id: targetSkill.id, skillOrder: currentOrder },
    ]

    try {
      const response = await authFetch('/api/admin/skills', {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
      })

      if (response.ok) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error moving skill:', error)
      alert('Error updating skill order')
    }
  }

  // Group skills by category and sort
  const categories = [...new Set(skills.map(s => s.category))]
    .map(cat => {
      const categorySkills = skills.filter(s => s.category === cat)
      const order = categorySkills[0]?.category_order || 0
      return { name: cat, order }
    })
    .sort((a, b) => a.order - b.order)
    .map(cat => cat.name)

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-black">Skills Management</h2>
          <p className="text-gray-600 mt-1">Manage skills and their display order</p>
        </div>
        <button
          onClick={() => {
            setEditingSkill(null)
            const maxCategoryOrder = Math.max(...skills.map(s => s.category_order || 0), -1)
            setFormData({ 
              name: '', 
              category: '', 
              proficiency: 80, 
              imageUrl: '', 
              categoryOrder: maxCategoryOrder + 1,
              skillOrder: 0
            })
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      <div className="space-y-8">
        {categories.map((category, categoryIndex) => {
          const categorySkills = skills
            .filter(s => s.category === category)
            .sort((a, b) => (a.skill_order || 0) - (b.skill_order || 0))
          
          return (
            <div key={category} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveCategory(category, 'up')}
                      disabled={categoryIndex === 0}
                      className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move category up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveCategory(category, 'down')}
                      disabled={categoryIndex === categories.length - 1}
                      className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move category down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">{category}</h3>
                    <p className="text-xs text-gray-500">
                      Order: {categorySkills[0]?.category_order || 0} • {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill, skillIndex) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 p-4 rounded-lg flex justify-between items-start hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveSkill(skill, 'up')}
                            disabled={skillIndex === 0}
                            className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move skill up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveSkill(skill, 'down')}
                            disabled={skillIndex === categorySkills.length - 1}
                            className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move skill down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                        <div>
                          <p className="font-medium text-black">{skill.name}</p>
                          <p className="text-xs text-gray-500">
                            Order: {skill.skill_order || 0} • {skill.proficiency}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-black hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full my-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-bold text-black">
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                  placeholder="e.g., Frontend, Backend, Database"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Proficiency ({formData.proficiency}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Category Order</label>
                  <input
                    type="number"
                    value={formData.categoryOrder}
                    onChange={(e) => setFormData({ ...formData, categoryOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Skill Order</label>
                  <input
                    type="number"
                    value={formData.skillOrder}
                    onChange={(e) => setFormData({ ...formData, skillOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Within category</p>
                </div>
              </div>

              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="skills"
                label="Skill Image (Optional)"
                placeholder="Enter image URL or upload a file"
              />
              </div>

              <div className="flex gap-4 p-6 pt-4 border-t border-gray-200 flex-shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  {editingSkill ? 'Update' : 'Create'}
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

export default SkillsManager
