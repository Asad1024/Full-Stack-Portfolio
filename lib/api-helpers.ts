import { createSupabaseClient } from './supabase/client'

export async function getAuthHeaders(contentType: boolean = true) {
  const supabase = createSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers: HeadersInit = {}
  
  if (contentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  // Add access token to headers if session exists
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

// Wrapper for fetch that automatically adds auth headers
export async function authFetch(url: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders(options.method !== 'GET')
  
  // Log if no token (for debugging)
  if (!headers['Authorization']) {
    console.warn('No access token found in session for request to:', url)
  }
  
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...options.headers,
    },
  })
}
