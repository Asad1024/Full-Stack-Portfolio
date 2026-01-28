'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface ProfileData {
  name: string
  title: string
  description: string
  imageUrl?: string
}

const ProfileManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<ProfileData>()
  const imageUrl = watch('imageUrl')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { authFetch } = await import('@/lib/api-helpers')
        const response = await authFetch('/api/admin/profile')
        if (response.ok) {
          const data = await response.json()
          if (data && !data.error) {
            reset(data)
          } else if (data?.error) {
            console.error('API Error:', data.error, data.details)
            setMessage({ type: 'error', text: `Failed to load: ${data.error}` })
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Fetch Error:', response.status, errorData)
          setMessage({ type: 'error', text: `Failed to load profile (${response.status})` })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setMessage({ type: 'error', text: 'Network error loading profile' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: ProfileData) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const { authFetch } = await import('@/lib/api-helpers')
      const response = await authFetch('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Update error:', response.status, errorData)
        setMessage({ 
          type: 'error', 
          text: errorData.details 
            ? `Failed: ${errorData.details}` 
            : `Failed to update profile (${response.status})` 
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
            Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder="Your Professional Title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-none"
            placeholder="Brief description about yourself"
          />
        </div>

        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url)}
          folder="profile"
          label="Profile Image"
          placeholder="Enter image URL or upload a file"
        />

        {message && (
          <div
            className={`p-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default ProfileManager
