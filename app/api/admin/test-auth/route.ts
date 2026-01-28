import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    
    const supabase = createSupabaseServerClient()
    
    // Try both methods
    const sessionResult = await supabase.auth.getSession()
    const userResult = await supabase.auth.getUser()
    
    return NextResponse.json({
      session: {
        hasSession: !!sessionResult.data.session,
        error: sessionResult.error?.message,
        userId: sessionResult.data.session?.user?.id,
      },
      user: {
        hasUser: !!userResult.data.user,
        error: userResult.error?.message,
        userId: userResult.data.user?.id,
        email: userResult.data.user?.email,
      },
      cookies: {
        count: allCookies.length,
        names: allCookies.map(c => c.name),
        hasAuthCookies: allCookies.some(c => c.name.includes('auth')),
        note: 'Check browser DevTools > Application > Cookies to see if Supabase cookies are set',
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
