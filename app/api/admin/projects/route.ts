import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const projects = (data || []).map((project: any) => ({
      ...project,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies 
        : project.technologies ? JSON.parse(project.technologies) : [],
      githubUrl: project.github_url || project.githubUrl,
      liveUrl: project.live_url || project.liveUrl,
      imageUrl: project.image_url || project.imageUrl,
      demoVideoUrl: project.demo_video_url || project.demoVideoUrl,
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

export async function POST(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const body = await request.json()
    const projectData = {
      title: body.title,
      description: body.description,
      technologies: Array.isArray(body.technologies) 
        ? JSON.stringify(body.technologies) 
        : body.technologies,
      github_url: body.githubUrl || body.github_url,
      live_url: body.liveUrl || body.live_url,
      image_url: body.imageUrl || body.image_url,
      demo_video_url: body.demoVideoUrl || body.demo_video_url,
      role: body.role || null,
      published_date: body.publishedDate || body.published_date || null,
      map_url: body.mapUrl || body.map_url || null,
      featured: body.featured || false,
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create project', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const body = await request.json()
    const { id, ...rest } = body
    
    const projectData = {
      title: rest.title,
      description: rest.description,
      technologies: Array.isArray(rest.technologies) 
        ? JSON.stringify(rest.technologies) 
        : rest.technologies,
      github_url: rest.githubUrl || rest.github_url,
      live_url: rest.liveUrl || rest.live_url,
      image_url: rest.imageUrl || rest.image_url,
      demo_video_url: rest.demoVideoUrl || rest.demo_video_url,
      role: rest.role || null,
      published_date: rest.publishedDate || rest.published_date || null,
      map_url: rest.mapUrl || rest.map_url || null,
      featured: rest.featured || false,
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
