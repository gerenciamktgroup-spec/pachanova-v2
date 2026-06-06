import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Long-term improved matcher.
 * 
 * We only run the Supabase session middleware on routes that actually need it:
 * - Protected dashboard areas
 * - Auth pages
 * - API routes that may rely on session (tRPC, etc.)
 * 
 * Public marketing pages (/, /como-funciona, /preguntas-frecuentes, /demo/*, etc.)
 * no longer pay the cost and will not crash if Supabase env vars are missing.
 */
export const config = {
  matcher: [
    /*
     * Match only routes that require auth/session logic:
     * - Dashboard (all protected areas)
     * - Login / Signup flows
     * - tRPC and other internal APIs that may need user context
     */
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/unauthorized',
    '/api/trpc/:path*',
    // Add other protected API groups here if needed in the future
    // '/api/admin/:path*',
  ],
}
