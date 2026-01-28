import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category_order', { ascending: true })
      .order('skill_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    const skills = (data || []).map((skill: any) => ({
      ...skill,
      imageUrl: skill.image_url || skill.imageUrl,
    }))

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
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
    const skillData = {
      name: body.name,
      category: body.category,
      proficiency: body.proficiency,
      image_url: body.imageUrl || body.image_url,
      category_order: body.categoryOrder !== undefined ? body.categoryOrder : body.category_order || 0,
      skill_order: body.skillOrder !== undefined ? body.skillOrder : body.skill_order || 0,
    }
    
    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
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
    const updateData: any = {
      name: rest.name,
      category: rest.category,
      proficiency: rest.proficiency,
      image_url: rest.imageUrl || rest.image_url,
    }
    
    // Include ordering fields if provided
    if (rest.categoryOrder !== undefined || rest.category_order !== undefined) {
      updateData.category_order = rest.categoryOrder !== undefined ? rest.categoryOrder : rest.category_order
    }
    if (rest.skillOrder !== undefined || rest.skill_order !== undefined) {
      updateData.skill_order = rest.skillOrder !== undefined ? rest.skillOrder : rest.skill_order
    }
    
    const { data, error } = await supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
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
      .from('skills')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
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

    // Update all skills in a transaction-like manner
    const updatePromises = updates.map((update: { id: string; categoryOrder?: number; skillOrder?: number }) => {
      const updateData: any = {}
      if (update.categoryOrder !== undefined) {
        updateData.category_order = update.categoryOrder
      }
      if (update.skillOrder !== undefined) {
        updateData.skill_order = update.skillOrder
      }
      
      return supabase
        .from('skills')
        .update(updateData)
        .eq('id', update.id)
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating skill orders:', error)
    return NextResponse.json(
      { error: 'Failed to update skill orders' },
      { status: 500 }
    )
  }
}
