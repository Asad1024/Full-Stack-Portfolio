'use client'

import { useEffect, useState, useMemo } from 'react'
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'
import { SERVICE_ICON_LIBRARY, resolveServiceIconKey } from '@/lib/service-icons'

interface Service {
  id: string
  title: string
  description: string
  icon?: string | null
  display_order: number
}

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    displayOrder: 0,
  })
  const [iconSearch, setIconSearch] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await authFetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(Array.isArray(data) ? data : [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to load services: ${errorData.error || response.status}`)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      alert('Network error loading services')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/admin/services'
      const method = editingService ? 'PUT' : 'POST'
      const body = editingService
        ? { ...formData, id: editingService.id }
        : formData

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchServices()
        setIsModalOpen(false)
        setEditingService(null)
        setFormData({ title: '', description: '', icon: '', displayOrder: 0 })
      } else {
        const err = await response.json().catch(() => ({}))
        alert(err.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Error saving service:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      const response = await authFetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
      displayOrder: service.display_order ?? 0,
    })
    setIconSearch('')
    setIsModalOpen(true)
  }

  const handleMove = async (service: Service, direction: 'up' | 'down') => {
    const sorted = [...services].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex((s) => s.id === service.id)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const target = sorted[targetIdx]
    const updates = [
      { id: service.id, displayOrder: target.display_order },
      { id: target.id, displayOrder: service.display_order },
    ]
    try {
      const response = await authFetch('/api/admin/services', {
        method: 'PATCH',
        body: JSON.stringify({ updates }),
      })
      if (response.ok) fetchServices()
    } catch (error) {
      console.error('Error reordering:', error)
    }
  }

  const sortedServices = [...services].sort((a, b) => a.display_order - b.display_order)

  const resolvedIconKey = resolveServiceIconKey(formData.icon) ?? (formData.icon || '')
  const filteredIcons = useMemo(() => {
    const q = iconSearch.toLowerCase().trim()
    if (!q) return SERVICE_ICON_LIBRARY
    return SERVICE_ICON_LIBRARY.filter((e) => e.key.includes(q))
  }, [iconSearch])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading services...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black">Services Management</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage services shown on the Services page</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingService(null)
            const maxOrder = Math.max(...services.map((s) => s.display_order), -1)
            setFormData({
              title: '',
              description: '',
              icon: '',
              displayOrder: maxOrder + 1,
            })
            setIconSearch('')
            setIsModalOpen(true)
          }}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto shrink-0"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Service cards — each card has Edit and Delete icons on the card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedServices.map((service, index) => (
          <div
            key={service.id}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col overflow-hidden"
          >
            {/* Card header: title + Edit/Delete icons */}
            <div className="p-4 md:p-5 pb-2 flex items-start justify-between gap-3">
              <h3 className="font-semibold text-black text-base md:text-lg truncate flex-1 min-w-0 pt-0.5">
                {service.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(service)}
                  className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                  title="Edit"
                  aria-label="Edit service"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                  aria-label="Delete service"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {/* Card body: description */}
            <div className="px-4 md:px-5 py-2 flex-1 min-h-0">
              <p className="text-sm text-gray-500 line-clamp-3">
                {service.description}
              </p>
            </div>
            {/* Card footer: order + move up/down */}
            <div className="px-4 md:px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-400">Order: {service.display_order}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleMove(service, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move up"
                  aria-label="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(service, 'down')}
                  disabled={index === sortedServices.length - 1}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move down"
                  aria-label="Move down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedServices.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 px-6 text-center">
          <p className="text-gray-500">No services yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Service&quot; to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col my-auto shadow-xl">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-black">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none bg-white text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none bg-white text-black min-h-[100px] resize-y"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">Icon</label>
                  <p className="text-xs text-gray-500 mb-2">Pick an icon from the library (free Lucide icons)</p>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      placeholder="Search icons..."
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none bg-white text-black text-sm"
                    />
                  </div>
                  <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto bg-gray-50/50">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: '' })}
                        title="No icon"
                        className={`flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-colors ${
                          !formData.icon
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <X size={16} />
                      </button>
                      {filteredIcons.map(({ key, Icon }) => {
                        if (!Icon) return null
                        const isSelected = resolvedIconKey === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: key })}
                            title={key}
                            className={`flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-colors ${
                              isSelected
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            <Icon size={18} strokeWidth={1.5} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {formData.icon && (
                    <p className="text-xs text-gray-500 mt-1.5">Selected: <span className="font-medium text-black">{formData.icon}</span></p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">Display order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none bg-white text-black"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex gap-3 p-4 md:p-6 border-t border-gray-200 shrink-0">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-100 transition-colors"
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

export default ServicesManager
