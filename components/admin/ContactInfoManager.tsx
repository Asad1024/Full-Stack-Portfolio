'use client'

import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api-helpers'

interface ContactInfo {
  email?: string
  phone?: string
  location?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  website_url?: string
}

const ContactInfoManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    website_url: '',
  })

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await authFetch('/api/admin/profile')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            linkedin_url: data.linkedin_url || '',
            github_url: data.github_url || '',
            twitter_url: data.twitter_url || '',
            website_url: data.website_url || '',
          })
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // First get the current profile to preserve other fields
      const profileResponse = await authFetch('/api/admin/profile')
      const currentProfile = profileResponse.ok ? await profileResponse.json() : {}

      const updateData = {
        ...currentProfile,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        twitter_url: formData.twitter_url,
        website_url: formData.website_url,
        imageUrl: currentProfile.image_url || currentProfile.imageUrl,
      }

      const response = await authFetch('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        alert('Contact information updated successfully!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to update: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Error saving contact information')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black">Contact Information</h2>
        <p className="text-gray-600 mt-1">Manage your contact details displayed in the Contact section</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
              placeholder="Available Worldwide"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-black mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Twitter/X URL</label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Contact Information'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactInfoManager
