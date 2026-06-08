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
  
  // Páginas públicas que no requieren autenticación (como Landing Page y FAQ)
  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/como-funciona') || 
                       request.nextUrl.pathname.startsWith('/preguntas-frecuentes');

  // Si no hay usuario y trata de entrar al dashboard (y no es una API, ni Auth, ni Pública), mandarlo al login
  if (!user && !isAuthPage && !isApiRoute && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si está autenticado, verificamos el rol (solo para páginas normales, no para APIs, login, ni públicas)
  if (user && !isAuthPage && !isApiRoute && !isPublicPage) {
    // Rol sincronizado vía trigger Supabase: public.investors.role → auth.users.raw_app_meta_data.role
    const role = (user.app_metadata?.role as string | undefined) || 'investor';
    if (request.nextUrl.pathname === '/dashboard') {
      const url = request.nextUrl.clone();
      if (role === 'admin' || role === 'operator') {
        url.pathname = '/dashboard/admin';
      } else {
        url.pathname = '/dashboard/investor';
      }
      return NextResponse.redirect(url);
    }

    const isInvestorPath = request.nextUrl.pathname.startsWith('/dashboard/investor');
    const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard/admin');
    
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
