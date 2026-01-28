import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json(data || {
      title: 'About Me',
      content: 'Experienced Full Stack Developer with a passion for creating innovative digital solutions.',
    })
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json({
      title: 'About Me',
      content: 'Experienced Full Stack Developer with a passion for creating innovative digital solutions.',
    })
  }
}
