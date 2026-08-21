import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a mock Supabase client for demo/local UI mode
    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: 'demo-user-id',
              email: 'demo@grainz3d.com',
              user_metadata: { full_name: 'Grainz Demo User' },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            }
          },
          error: null
        }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'demo-user-id', email: 'demo@grainz3d.com' }, session: {} }, error: null }),
        signUp: async () => ({ data: { user: { id: 'demo-user-id', email: 'demo@grainz3d.com' }, session: {} }, error: null }),
        signInWithOAuth: async () => ({ data: { url: '/dashboard' }, error: null }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        updateUser: async () => ({ data: { user: {} }, error: null }),
      },
      from: (tableName: string) => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: async () => ({ data: { full_name: 'Grainz Demo User', email: 'demo@grainz3d.com', avatar_url: '' }, error: null }),
              order: async () => ({ data: [], error: null }),
            }),
            single: async () => ({ data: { full_name: 'Grainz Demo User', email: 'demo@grainz3d.com', avatar_url: '' }, error: null }),
            order: async () => ({ data: [], error: null }),
          }),
          single: async () => ({ data: { full_name: 'Grainz Demo User', email: 'demo@grainz3d.com', avatar_url: '' }, error: null }),
          order: async () => ({ data: [], error: null }),
        }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ eq: async () => ({ data: null, error: null }) }),
        delete: async () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
    } as any
  }

  return createServerClient(
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
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
