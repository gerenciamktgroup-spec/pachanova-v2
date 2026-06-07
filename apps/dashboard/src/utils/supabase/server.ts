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
    // @ts-ignore
    client.auth.signInWithPassword = async (credentials: any) => {
      const { email, password } = credentials;
      
      if (email === 'carlos.mendoza@demo.pachanova.io' && password === 'Demo2026!') {
        const mockUser = {
          id: 'carlos-mendoza-mock-uuid',
          email: 'carlos.mendoza@demo.pachanova.io',
          app_metadata: { role: 'admin' },
          user_metadata: { full_name: 'Carlos Mendoza', first_name: 'Carlos', last_name: 'Mendoza' },
          aud: 'authenticated',
          role: 'authenticated'
        };
        cookieStore.set('pachanova-mock-session', JSON.stringify(mockUser), { path: '/' });
        return { data: { user: mockUser, session: { access_token: 'mock-token', user: mockUser } }, error: null };
      }

      if (email === 'investor@pachanova.local' && password === 'Demo2026!') {
        const mockUser = {
          id: 'demo-holder-mock-uuid',
          email: 'investor@pachanova.local',
          app_metadata: { role: 'investor' },
          user_metadata: { full_name: 'Demo Holder', first_name: 'Demo', last_name: 'Holder' },
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
