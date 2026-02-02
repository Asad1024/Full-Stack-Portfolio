import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)

    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .order('title', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
    const serviceData = {
      title: body.title,
      description: body.description,
      icon: body.icon || null,
      display_order: body.displayOrder ?? body.display_order ?? 0,
    }

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
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
      title: rest.title,
      description: rest.description,
      icon: rest.icon ?? null,
      display_order: rest.displayOrder ?? rest.display_order ?? 0,
    }

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
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
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)

    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const body = await request.json()
    const { updates } = body

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    const updatePromises = updates.map(
      (update: { id: string; displayOrder?: number }) => {
        const updateData: { display_order?: number } = {}
        if (update.displayOrder !== undefined) {
          updateData.display_order = update.displayOrder
        }
        return supabase
          .from('services')
          .update(updateData)
          .eq('id', update.id)
      }
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating service orders:', error)
    return NextResponse.json(
      { error: 'Failed to update service orders' },
      { status: 500 }
    )
  }
}
