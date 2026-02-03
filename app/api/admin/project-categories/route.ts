import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)

    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching project categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project categories' },
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
    const categoryData = {
      name: (body.name || '').trim(),
      display_order: body.displayOrder ?? body.display_order ?? 0,
    }

    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('project_categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating project category:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create project category' },
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
    const { id, oldName, ...rest } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      display_order: rest.displayOrder ?? rest.display_order,
    }
    if (rest.name !== undefined) {
      updateData.name = (rest.name || '').trim()
    }

    const { data, error } = await supabase
      .from('project_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // If name changed, update projects that use the old category name
    if (oldName && updateData.name && oldName !== updateData.name) {
      await supabase
        .from('projects')
        .update({ category: updateData.name })
        .eq('category', oldName)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating project category:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update project category' },
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

    // Get category name before delete to update projects
    const { data: cat } = await supabase
      .from('project_categories')
      .select('name')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('project_categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    // Set projects with this category to 'Original'
    if (cat?.name) {
      await supabase
        .from('projects')
        .update({ category: 'Original' })
        .eq('category', cat.name)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project category:', error)
    return NextResponse.json(
      { error: 'Failed to delete project category' },
      { status: 500 }
    )
  }
}
