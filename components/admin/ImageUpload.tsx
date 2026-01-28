'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/supabase/storage'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  placeholder?: string
}

const ImageUpload = ({ 
  value, 
  onChange, 
  folder = 'images',
  label = 'Image',
  placeholder = 'Enter image URL or upload a file'
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const url = await uploadImage(file, folder)
      if (url) {
        setInputValue(url)
        onChange(url)
      } else {
        setUploadError('Failed to upload image. Please try again.')
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Upload failed. Please try again.'
      setUploadError(errorMessage)
      console.error('Upload error:', error)
      
      // If it's a policy error, show helpful message
      if (errorMessage.includes('Storage policy') || errorMessage.includes('row-level security')) {
        setUploadError(`${errorMessage} Check STORAGE_SETUP.md for setup instructions.`)
      }
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setInputValue(url)
    onChange(url)
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')
    setUploadError(null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      
      <div className="space-y-2">
        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={inputValue}
            onChange={handleUrlChange}
            className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none bg-white text-black"
            placeholder={placeholder}
            disabled={isUploading}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-100 text-black"
              disabled={isUploading}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* File Upload */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${folder}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`file-upload-${folder}`}
            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span className="text-sm">Upload Image</span>
              </>
            )}
          </label>
        </div>

        {/* Preview */}
        {inputValue && !uploadError && (
          <div className="mt-2">
            <img
              src={inputValue}
              alt="Preview"
              className="max-w-xs max-h-48 object-contain border border-gray-200"
              onError={() => setUploadError('Failed to load image. Please check the URL.')}
            />
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}

        <p className="text-xs text-gray-500">
          Enter an image URL or upload a file (max 5MB). Images are stored in Supabase Storage.
        </p>
      </div>
    </div>
  )
}

export default ImageUpload
