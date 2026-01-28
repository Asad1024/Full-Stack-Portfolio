import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('project_filters')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching project filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project filters' },
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
    const filterData = {
      name: body.name,
      display_order: body.displayOrder || body.display_order || 0,
      is_active: body.isActive !== undefined ? body.isActive : true,
    }
    
    const { data, error } = await supabase
      .from('project_filters')
      .insert([filterData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating project filter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project filter' },
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
    const updateData = {
      name: rest.name,
      display_order: rest.displayOrder || rest.display_order,
      is_active: rest.isActive !== undefined ? rest.isActive : rest.is_active,
    }
    
    const { data, error } = await supabase
      .from('project_filters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating project filter:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project filter' },
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
      .from('project_filters')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project filter:', error)
    return NextResponse.json(
      { error: 'Failed to delete project filter' },
      { status: 500 }
    )
  }
}
