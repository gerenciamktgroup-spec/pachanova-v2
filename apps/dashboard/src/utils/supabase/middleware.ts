import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Dashboard Middleware] Supabase config missing. Bypassing auth for local demo.')
    return NextResponse.next()
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

  let user: any = null;
  const mockSession = request.cookies.get('pachanova-mock-session')?.value;
  if (mockSession && (process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true')) {
    try {
      user = JSON.parse(mockSession);
    } catch (e) {}
  }

  if (!user) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch (err: any) {
      console.warn('[Dashboard Middleware] Supabase offline or host unreachable:', err.message);
    }
  }

  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/unauthorized');

  // Si no hay usuario y trata de entrar al dashboard (y no es una API ni una página de login/unauthorized), mandarlo al login
  if (!user && !isAuthPage && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si está autenticado, verificamos el rol (solo para páginas normales, no para APIs ni login)
  if (user && !isAuthPage && !isApiRoute) {
    // Rol sincronizado vía trigger Supabase: public.investors.role → auth.users.raw_app_meta_data.role
    const role = (user.app_metadata?.role as string | undefined) || 'investor';
    const isInvestorPath = request.nextUrl.pathname.startsWith('/dashboard/investor');
    const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard/admin') || request.nextUrl.pathname === '/dashboard';
    
    if (isInvestorPath && role !== 'investor' && role !== 'admin' && role !== 'operator') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
    
    if (isAdminPath && role !== 'admin' && role !== 'operator') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse
}
