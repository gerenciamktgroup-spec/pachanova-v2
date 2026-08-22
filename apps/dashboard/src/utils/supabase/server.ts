import { createServerClient as createServerClientSSR } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()

  const client = createServerClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  if (process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO === 'true') {
    const originalGetUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = async (token?: string) => {
      const mockSession = cookieStore.get('pachanova-mock-session')?.value;
      if (mockSession) {
        try {
          const user = JSON.parse(mockSession);
          return { data: { user }, error: null };
        } catch (e) {}
      }
      try {
        return await originalGetUser(token);
      } catch (err: any) {
        console.warn("[Supabase mock fallback] Offline or DNS lookup failed for getUser:", err.message);
        return { data: { user: null }, error: err };
      }
    };

    const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth);
    // @ts-expect-error Mocking signInWithPassword for demo mode
    client.auth.signInWithPassword = async (credentials: any) => {
      const { email, password } = credentials;
      
      const demoUsers: Record<string, { id: string; role: string; full_name: string }> = {
        'admin@pachanova.local': { id: '11111111-1111-1111-1111-111111111111', role: 'admin', full_name: 'Administrador' },
        'inversor@pachanova.local': { id: '22222222-2222-2222-2222-222222222222', role: 'investor', full_name: 'Inversor Demo' },
        'cliente@pachanova.local': { id: '33333333-3333-3333-3333-333333333333', role: 'client', full_name: 'Cliente Demo' },
        'carlos.mendoza@demo.pachanova.io': { id: 'aaaa0000-0000-0000-0000-000000000000', role: 'admin', full_name: 'Carlos Mendoza' },
        'investor@pachanova.local': { id: 'bbbb0000-0000-0000-0000-000000000000', role: 'investor', full_name: 'Demo Holder' },
      };
      const demo = demoUsers[email];
      if (demo && (password === 'Demo2026!' || password === 'password123')) {
        const mockUser = {
          id: demo.id,
          email,
          app_metadata: { role: demo.role },
          user_metadata: { full_name: demo.full_name },
          aud: 'authenticated',
          role: 'authenticated'
        };
        cookieStore.set('pachanova-mock-session', JSON.stringify(mockUser), { path: '/' });
        return { data: { user: mockUser, session: { access_token: 'mock-token', user: mockUser } }, error: null };
      }

      try {
        const res = await originalSignInWithPassword(credentials);
        if (res.data.user) {
          cookieStore.set('pachanova-mock-session', JSON.stringify(res.data.user), { path: '/' });
        }
        return res;
      } catch (err: any) {
        console.warn("[Supabase mock fallback] Offline sign in failed:", err.message);
        return { data: { user: null, session: null }, error: err };
      }
    };

    const originalSignOut = client.auth.signOut.bind(client.auth);
    client.auth.signOut = async (options) => {
      cookieStore.delete('pachanova-mock-session');
      try {
        return await originalSignOut(options);
      } catch (err) {
        return { error: null };
      }
    };
  }

  return client;
}
