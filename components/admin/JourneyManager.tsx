'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { authFetch } from '@/lib/api-helpers'
import ImageUpload from './ImageUpload'

interface JourneyData {
  title: string
  content: string
  imageUrl: string
  headline: string
  whoIAm: string
  whatIDo: string
  shortTermGoals: string
  longTermGoals: string
  experience: string
  howIWork: string
}

const defaultValues: JourneyData = {
  title: 'My Journey',
  content: '',
  imageUrl: '',
  headline: '',
  whoIAm: '',
  whatIDo: '',
  shortTermGoals: '',
  longTermGoals: '',
  experience: '',
  howIWork: '',
}

const JourneyManager = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<JourneyData>({
    defaultValues,
  })

  const imageUrl = watch('imageUrl')

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await authFetch('/api/admin/journey')
        if (response.ok) {
          const data = await response.json()
          if (data && !data.error) {
            reset({
              title: data.title ?? defaultValues.title,
              content: data.content ?? '',
              imageUrl: data.imageUrl ?? data.image_url ?? '',
              headline: data.headline ?? '',
              whoIAm: data.whoIAm ?? data.who_i_am ?? '',
              whatIDo: data.whatIDo ?? data.what_i_do ?? '',
              shortTermGoals: data.shortTermGoals ?? data.short_term_goals ?? '',
              longTermGoals: data.longTermGoals ?? data.long_term_goals ?? '',
              experience: data.experience ?? '',
              howIWork: data.howIWork ?? data.how_i_work ?? '',
            })
          } else if (data?.error) {
            setMessage({ type: 'error', text: `Failed to load: ${data.error}` })
          }
        } else {
          setMessage({ type: 'error', text: `Failed to load journey (${response.status})` })
        }
      } catch (error) {
        console.error('Error fetching journey:', error)
        setMessage({ type: 'error', text: 'Network error loading journey' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchJourney()
  }, [reset])

  const onSubmit = async (data: JourneyData) => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await authFetch('/api/admin/journey', {
        method: 'PUT',
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || null,
          headline: data.headline,
          whoIAm: data.whoIAm,
          whatIDo: data.whatIDo,
          shortTermGoals: data.shortTermGoals,
          longTermGoals: data.longTermGoals,
          experience: data.experience,
          howIWork: data.howIWork,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Journey updated successfully!' })
      } else {
        const errorData = await response.json().catch(() => ({}))
        setMessage({
          type: 'error',
          text: errorData.error || `Failed to update journey (${response.status})`,
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
      <h2 className="text-3xl font-bold text-black mb-2">Journey</h2>
      <p className="text-gray-600 mb-6">
        Manage your Journey page: title, headline, image, and structured sections (Who I Am, What I Do, Goals, Experience, How I Work). Use one item per line for list fields.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
            Page Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder="My Journey"
          />
        </div>

        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-black mb-2">
            Headline (below title, in hero)
          </label>
          <input
            {...register('headline')}
            type="text"
            id="headline"
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder="A short tagline or summary"
          />
        </div>

        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('imageUrl', url)}
          folder="journey"
          label="Journey / Profile Image"
          placeholder="Enter image URL or upload (used on Journey page)"
        />

        <div>
          <label htmlFor="whoIAm" className="block text-sm font-medium text-black mb-2">
            Who I Am (narrative, optional)
          </label>
          <textarea
            {...register('whoIAm')}
            id="whoIAm"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder="A few paragraphs about yourself. Each new line = new paragraph."
          />
        </div>

        <div>
          <label htmlFor="whatIDo" className="block text-sm font-medium text-black mb-2">
            What I Do (one per line)
          </label>
          <textarea
            {...register('whatIDo')}
            id="whatIDo"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder={'Full-stack development\nUI/UX design\n...'}
          />
        </div>

        <div>
          <label htmlFor="shortTermGoals" className="block text-sm font-medium text-black mb-2">
            Short-term goals (one per line)
          </label>
          <textarea
            {...register('shortTermGoals')}
            id="shortTermGoals"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder={'Ship side project\nLearn X\n...'}
          />
        </div>

        <div>
          <label htmlFor="longTermGoals" className="block text-sm font-medium text-black mb-2">
            Long-term goals (one per line)
          </label>
          <textarea
            {...register('longTermGoals')}
            id="longTermGoals"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder="Lead a product team&#10;..."
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-black mb-2">
            Experience (one entry per line)
          </label>
          <textarea
            {...register('experience')}
            id="experience"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder={'2020–Present · Role at Company\n2018–2020 · Previous role\n...'}
          />
        </div>

        <div>
          <label htmlFor="howIWork" className="block text-sm font-medium text-black mb-2">
            How I Work (one per line, shown as pills)
          </label>
          <textarea
            {...register('howIWork')}
            id="howIWork"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder={'User-first design\nIterative development\n...'}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
            Legacy / fallback content (if no sections filled)
          </label>
          <textarea
            {...register('content')}
            id="content"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white text-black resize-y"
            placeholder="Optional: plain story. Each new line = paragraph. Shown only when sections above are empty."
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
          {isSaving ? 'Saving...' : 'Save Journey'}
        </button>
      </form>
    </div>
  )
}

export default JourneyManager
