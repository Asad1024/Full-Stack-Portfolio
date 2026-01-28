import { createSupabaseServerClient } from './supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function checkApiAuth(request: Request) {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization')
  let supabase = createSupabaseServerClient()
  let user = null
  let error = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      // Create a client with the token for all operations
      const supabaseWithToken = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
      const { data: { user: tokenUser }, error: tokenError } = await supabaseWithToken.auth.getUser()
      if (!tokenError && tokenUser) {
        return { user: tokenUser, supabase: supabaseWithToken, error: null }
      }
      error = tokenError
    } catch (e: any) {
      error = e
    }
  }

  // If no user from token, try cookies
  const { data: { user: cookieUser }, error: userError } = await supabase.auth.getUser()
  if (userError || !cookieUser) {
    return { 
      user: null, 
      supabase, 
      error: userError?.message || error?.message || 'No session found' 
    }
  }

  return { user: cookieUser, supabase, error: null }
}

export function unauthorizedResponse(details?: string) {
  return NextResponse.json(
    { error: 'Unauthorized', details: details || 'Authentication required' },
    { status: 401 }
  )
}
