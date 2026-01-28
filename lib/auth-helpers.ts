import { createSupabaseServerClient } from './supabase/server'

export async function checkAuth() {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { user: null, error: error?.message || 'Unauthorized' }
  }
  
  return { user, error: null }
}
