import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string | undefined = (process as any).env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey: string | undefined = (process as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function requireEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  }
}

export function getSupabaseBrowserClient() {
  const { supabaseUrl: url, supabaseAnonKey: key } = requireEnv()
  return createClient(url, key)
}

export async function getSupabaseServerAuthClient() {
  const { cookies }: any = await import('next/headers')
  const cookieStore = await cookies()
  const { supabaseUrl: url, supabaseAnonKey: key } = requireEnv()

  const { createServerClient }: any = await import('@supabase/ssr')

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}
