import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return unauthorizedResponse(authError)
    }

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
    } : null

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return unauthorizedResponse(authError)
    }
    
    // Use the authenticated supabase client

    const body = await request.json()
    const profileData: any = {
      name: body.name,
      title: body.title,
      description: body.description,
      image_url: body.imageUrl || body.image_url,
      id: body.id || '00000000-0000-0000-0000-000000000001',
    }
    
    // Include contact information fields if provided
    if (body.email !== undefined) profileData.email = body.email
    if (body.phone !== undefined) profileData.phone = body.phone
    if (body.location !== undefined) profileData.location = body.location
    if (body.linkedin_url !== undefined) profileData.linkedin_url = body.linkedin_url
    if (body.github_url !== undefined) profileData.github_url = body.github_url
    if (body.twitter_url !== undefined) profileData.twitter_url = body.twitter_url
    if (body.website_url !== undefined) profileData.website_url = body.website_url
    
    const { data, error } = await supabase
      .from('profile')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
