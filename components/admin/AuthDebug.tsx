'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient()
      
      // Check client-side session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      // Check cookies
      const cookies = document.cookie.split('; ').map(c => {
        const [name, value] = c.split('=')
        return { name, value: value?.substring(0, 50) }
      })
      
      // Test API call
      let apiResult = null
      try {
        const response = await fetch('/api/admin/test-auth', {
          credentials: 'include',
        })
        apiResult = await response.json()
      } catch (e) {
        apiResult = { error: String(e) }
      }
      
      // Test authFetch
      let authFetchTest = null
      try {
        const { authFetch } = await import('@/lib/api-helpers')
        const testResponse = await authFetch('/api/admin/test-auth')
        authFetchTest = await testResponse.json()
      } catch (e) {
        authFetchTest = { error: String(e) }
      }
      
      setDebugInfo({
        clientSession: {
          hasSession: !!session,
          hasAccessToken: !!session?.access_token,
          accessTokenLength: session?.access_token?.length || 0,
          userId: session?.user?.id,
          email: session?.user?.email,
          error: sessionError?.message,
        },
        clientUser: {
          hasUser: !!user,
          userId: user?.id,
          email: user?.email,
          error: userError?.message,
        },
        cookies: {
          count: cookies.length,
          names: cookies.map(c => c.name),
          authCookies: cookies.filter(c => c.name.includes('auth') || c.name.includes('supabase')),
        },
        apiTest: apiResult,
        authFetchTest: authFetchTest,
      })
    }
    
    checkAuth()
  }, [])

  if (!debugInfo) {
    return <div className="p-4 bg-gray-100 text-black">Loading debug info...</div>
  }

  return (
    <div className="p-4 bg-gray-100 text-black text-sm space-y-4">
      <h3 className="font-bold text-lg">Authentication Debug Info</h3>
      <pre className="bg-white p-4 overflow-auto text-xs">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}

export default AuthDebug
