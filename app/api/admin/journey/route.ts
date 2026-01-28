import { NextResponse } from 'next/server'
import { checkApiAuth, unauthorizedResponse } from '@/lib/api-auth'

function toCamelCase(data: Record<string, unknown> | null) {
  if (!data) return null
  return {
    title: data.title ?? 'My Journey',
    content: data.content ?? '',
    imageUrl: data.image_url ?? data.imageUrl ?? null,
    headline: data.headline ?? '',
    whoIAm: data.who_i_am ?? '',
    whatIDo: data.what_i_do ?? '',
    shortTermGoals: data.short_term_goals ?? '',
    longTermGoals: data.long_term_goals ?? '',
    experience: data.experience ?? '',
    howIWork: data.how_i_work ?? '',
  }
}

export async function GET(request: Request) {
  try {
    const { user, supabase, error: authError } = await checkApiAuth(request)
    if (authError || !user) {
      return unauthorizedResponse(authError)
    }

    const { data, error } = await supabase
      .from('journey')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(toCamelCase(data as Record<string, unknown> | null))
  } catch (error) {
    console.error('Error fetching journey:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journey' },
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
    const journeyData = {
      title: body.title ?? 'My Journey',
      content: body.content ?? '',
      image_url: body.imageUrl ?? body.image_url ?? null,
      headline: body.headline ?? '',
      who_i_am: body.whoIAm ?? body.who_i_am ?? '',
      what_i_do: body.whatIDo ?? body.what_i_do ?? '',
      short_term_goals: body.shortTermGoals ?? body.short_term_goals ?? '',
      long_term_goals: body.longTermGoals ?? body.long_term_goals ?? '',
      experience: body.experience ?? '',
      how_i_work: body.howIWork ?? body.how_i_work ?? '',
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('journey')
      .upsert({ id: '00000000-0000-0000-0000-000000000001', ...journeyData }, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(toCamelCase(data as Record<string, unknown>))
  } catch (error) {
    console.error('Error updating journey:', error)
    return NextResponse.json(
      { error: 'Failed to update journey' },
      { status: 500 }
    )
  }
}
