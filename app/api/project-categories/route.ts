import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from('project_categories')
      .select('id, name, display_order')
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
