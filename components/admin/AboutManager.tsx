'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'

interface AboutData {
  title: string
  content: string
}

const AboutManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { register, handleSubmit, reset } = useForm<AboutData>()

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await authFetch('/api/admin/about')
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
          setMessage({ type: 'error', text: `Failed to load about (${response.status})` })
        }
      } catch (error) {
        console.error('Error fetching about:', error)
        setMessage({ type: 'error', text: 'Network error loading about' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAbout()
  }, [reset])

  const onSubmit = async (data: AboutData) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await authFetch('/api/admin/about', {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'About section updated successfully!' })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Update error:', response.status, errorData)
        setMessage({ 
          type: 'error', 
          text: errorData.details 
            ? `Failed: ${errorData.details}` 
            : `Failed to update about section (${response.status})` 
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
      <h2 className="text-3xl font-bold text-black mb-6">About Section</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder="About Me"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
            Content
          </label>
          <textarea
            {...register('content')}
            id="content"
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-none"
            placeholder="Write about yourself..."
          />
        </div>

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

export default AboutManager
