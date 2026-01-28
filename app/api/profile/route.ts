import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const profile = data ? {
      ...data,
      imageUrl: data.image_url || data.imageUrl,
      github_url: data.github_url || null,
      linkedin_url: data.linkedin_url || null,
    } : {
      name: 'Full Stack Developer',
      title: 'Building Digital Solutions',
      description: 'Creating exceptional web experiences with modern technologies',
      imageUrl: null,
      github_url: null,
      linkedin_url: null,
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({
      name: 'Full Stack Developer',
      title: 'Building Digital Solutions',
      description: 'Creating exceptional web experiences with modern technologies',
    })
  }
}
