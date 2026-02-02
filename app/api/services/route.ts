import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

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
    return NextResponse.json([])
  }
}
