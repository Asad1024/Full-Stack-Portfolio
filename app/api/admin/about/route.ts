import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(data || null)
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about' },
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
    const aboutData = {
      ...body,
      id: body.id || '00000000-0000-0000-0000-000000000001',
    }
    
    const { data, error } = await supabase
      .from('about')
      .upsert(aboutData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { error: 'Failed to update about' },
      { status: 500 }
    )
  }
}
