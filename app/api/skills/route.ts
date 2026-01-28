import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
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
    return NextResponse.json([])
  }
}
