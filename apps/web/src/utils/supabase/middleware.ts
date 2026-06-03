import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Long-term resilient version.
 * 
 * If Supabase env vars are not configured (common in pure local/demo scenarios),
 * we avoid crashing the entire app.
 * 
 * - Public marketing pages (including the new Precision Spatial landing) work without Supabase.
 * - Protected routes (/dashboard) still redirect to /login if no session.
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // === GRACEFUL DEGRADATION: No Supabase configured ===
  if (!supabaseUrl || !supabaseAnonKey) {
    // Only protect dashboard routes
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Public routes (new landing, demo, como-funciona, etc.) → continue normally
    return NextResponse.next()
  }

  // === Normal Supabase flow (when env vars are present) ===
  let supabaseResponse = NextResponse.next({ request })

  // Skip auth check for public and demo routes — no DB needed
  const pathname = request.nextUrl.pathname
  if (
    !pathname.startsWith('/dashboard')
  ) {
    return supabaseResponse
  }

  // Demo mode: bypass auth for dashboard routes so visitors can explore without Supabase
  if (process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error('[Middleware] Auth check failed:', error)
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
