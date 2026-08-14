import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // === DEMO MODE BYPASS ===
  if (process.env.DEMO_MODE === 'true') {
    return NextResponse.next()
  }

  // === GRACEFUL DEGRADATION: No Supabase configured ===
  if (!supabaseUrl || !supabaseAnonKey) {
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/unauthorized');
    if (!isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const role = (user.app_metadata?.role as string | undefined) || 'investor'
  const pathname = request.nextUrl.pathname
  const allowedRoles = pathname.startsWith('/dashboard/investor')
    ? ['investor', 'admin', 'operator']
    : pathname.startsWith('/dashboard/fideicomiso')
      ? ['fiduciario', 'comite', 'admin', 'operator']
      : pathname.startsWith('/demo')
        ? ['investor', 'fiduciario', 'comite', 'admin', 'operator']
        : ['admin', 'operator']

  if (!allowedRoles.includes(role)) {
    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
