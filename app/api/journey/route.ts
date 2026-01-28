import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

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

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
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
    return NextResponse.json(null)
  }
}
