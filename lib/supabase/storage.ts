import { createSupabaseClient } from './client'

export async function uploadImage(file: File, folder: string = 'images'): Promise<string | null> {
  try {
    const supabase = createSupabaseClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      
      // Provide more helpful error messages
      if (error.message?.includes('row-level security') || error.message?.includes('new row violates')) {
        throw new Error('Storage policies not set up. Go to Supabase Dashboard → Storage → portfolio-assets → Policies tab. Create 3 policies: INSERT (authenticated), SELECT (public), DELETE (authenticated). See QUICK_STORAGE_FIX.md')
      } else if (error.message?.includes('Bucket not found')) {
        throw new Error('Bucket not found. Create bucket "portfolio-assets" in Supabase Storage and make it public.')
      }
      
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase.storage
      .from('portfolio-assets')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}
