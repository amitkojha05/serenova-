import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { patchConversationSchema } from '@/lib/api-schemas'
import { enforceRateLimit } from '@/lib/rate-limit'

type RouteContext = {
  params: Promise<{ id: string }>
}

function getAuthClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}

export async function PATCH(req: Request, ctx: RouteContext) {
  const cookieStore = await cookies()
  const supabase = getAuthClient(cookieStore)
  if (!supabase) return new Response('Supabase auth is not configured.', { status: 500 })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const rate = await enforceRateLimit(`user:${user.id}`, 'conversation-write')
  if (!rate.success) {
    return new Response('Rate limit exceeded. Please try again shortly.', {
      status: 429,
      headers: {
        'Retry-After': String(rate.retryAfter),
      },
    })
  }

  const { id } = await ctx.params
  const json = await req.json()
  const parsed = patchConversationSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json(
      {
        error: 'Invalid request body',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('conversations')
    .update({ title: parsed.data.title })
    .eq('id', id)

  if (error) return new Response(error.message, { status: 400 })
  return Response.json({ ok: true })
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const cookieStore = await cookies()
  const supabase = getAuthClient(cookieStore)
  if (!supabase) return new Response('Supabase auth is not configured.', { status: 500 })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const rate = await enforceRateLimit(`user:${user.id}`, 'conversation-write')
  if (!rate.success) {
    return new Response('Rate limit exceeded. Please try again shortly.', {
      status: 429,
      headers: {
        'Retry-After': String(rate.retryAfter),
      },
    })
  }

  const { id } = await ctx.params
  const { error } = await supabase.from('conversations').delete().eq('id', id)
  if (error) return new Response(error.message, { status: 400 })

  return Response.json({ ok: true })
}
