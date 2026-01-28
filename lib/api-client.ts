// Helper function to make authenticated API calls
export async function apiCall(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important: include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  return response
}
