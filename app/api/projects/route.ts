import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform technologies from string to array if needed and map field names
    const projects = (data || []).map((project: any) => ({
      ...project,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies 
        : project.technologies ? JSON.parse(project.technologies) : [],
      githubUrl: project.github_url || project.githubUrl,
      liveUrl: project.live_url || project.liveUrl,
      imageUrl: project.image_url || project.imageUrl,
      otherImages: project.other_images ? (typeof project.other_images === 'string' ? (() => { try { return JSON.parse(project.other_images) } catch { return [] } })() : project.other_images) : [],
      role: project.role || '',
      publishedDate: project.published_date || project.publishedDate || '',
      mapUrl: project.map_url || project.mapUrl || '',
    }))

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
