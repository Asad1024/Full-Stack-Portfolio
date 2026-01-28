import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Configure to use cookies so server can read session
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return document.cookie.split('; ').map(cookie => {
          const [name, ...rest] = cookie.split('=')
          return { name, value: decodeURIComponent(rest.join('=')) }
        })
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieString = [
            `${name}=${encodeURIComponent(value)}`,
            options?.path ? `path=${options.path}` : 'path=/',
            options?.maxAge ? `max-age=${options.maxAge}` : '',
            options?.domain ? `domain=${options.domain}` : '',
            options?.sameSite ? `samesite=${options.sameSite}` : 'samesite=lax',
            options?.secure ? 'secure' : '',
          ].filter(Boolean).join('; ')
          
          document.cookie = cookieString
        })
      },
    },
  })
}

export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
