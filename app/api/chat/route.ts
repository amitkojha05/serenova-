import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { google } from '@ai-sdk/google'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { chatRequestSchema } from '@/lib/api-schemas'
import { enforceRateLimit } from '@/lib/rate-limit'
import { runAgentGraph } from '@/lib/agents/graph'
import type { AgentId } from '@/lib/agents/types'

export const maxDuration = 60

const FALLBACK_SYSTEM = `You are Serenova AI, a compassionate breast-health assistant.
Provide accurate, evidence-based information about breast cancer awareness, screening,
symptoms, treatment, reconstruction options, and emotional support.
Never diagnose. Always recommend professional consultation for personal medical concerns.`

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return new Response('Supabase auth is not configured.', { status: 500 })
  }

  const cookieStore = await cookies()
  const authClient = createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const rate = await enforceRateLimit(`user:${user.id}`, 'chat')
  if (!rate.success) {
    return new Response('Rate limit exceeded. Please try again shortly.', {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter) },
    })
  }

  const json = await req.json()
  const parsed = chatRequestSchema.safeParse(json)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { messages, conversationId, useRag } = parsed.data as {
    messages: UIMessage[]
    conversationId?: string
    useRag?: boolean
  }

  const supabase = authClient
  const activeConversationId = conversationId ?? crypto.randomUUID()

  await supabase.from('conversations').upsert(
    { id: activeConversationId, user_id: user.id },
    { onConflict: 'id' }
  )

  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  const latestText = latestUserMessage?.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('\n') ?? ''

  const history = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-6)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.parts
        .filter((p) => p.type === 'text')
        .map((p) => (p as { type: 'text'; text: string }).text)
        .join('\n'),
    }))

  const hasConfig =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    process.env.PINECONE_API_KEY &&
    process.env.PINECONE_INDEX

  // ── Fallback path (no env or RAG disabled) ───────────────────────────────
  if (!hasConfig || !useRag) {
    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: FALLBACK_SYSTEM,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
      temperature: 0.7,
      maxOutputTokens: 900,
      onFinish: async ({ text }) => {
        await persistMessages(supabase, activeConversationId, latestText, text)
      },
    })
    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
      headers: new Headers({ 'X-Agent-Id': 'medical-rag' }),
    })
  }

  // ── Multi-agent path ──────────────────────────────────────────────────────
  try {
    const agentResult = await runAgentGraph(latestText, history)
    const selectedAgentId: AgentId = agentResult.agentId
    const viewerCommand = agentResult.viewerCommand
    const answerText = agentResult.answer

    // Re-stream via SDK so the client gets proper SSE protocol
    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: 'Repeat the assistant answer below VERBATIM. Do not add, change, or remove anything.',
      messages: [
        { role: 'user', content: latestText },
        { role: 'assistant', content: answerText },
        { role: 'user', content: 'Output the assistant answer above exactly.' },
      ],
      abortSignal: req.signal,
      temperature: 0,
      maxOutputTokens: 1200,
      onFinish: async ({ text }) => {
        await persistMessages(supabase, activeConversationId, latestText, text || answerText)
      },
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
      headers: new Headers({
        'X-Agent-Id': selectedAgentId,
        ...(viewerCommand ? { 'X-Viewer-Command': JSON.stringify(viewerCommand) } : {}),
      }),
    })
  } catch (err) {
    console.error('[multi-agent] error, falling back:', err)
    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: FALLBACK_SYSTEM,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
      temperature: 0.7,
      maxOutputTokens: 900,
      onFinish: async ({ text }) => {
        await persistMessages(supabase, activeConversationId, latestText, text)
      },
    })
    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
      headers: new Headers({ 'X-Agent-Id': 'medical-rag' }),
    })
  }
}

async function persistMessages(
  supabase: ReturnType<typeof createServerClient>,
  conversationId: string,
  userText: string,
  assistantText: string
) {
  const inserts: Array<{ conversation_id: string; role: string; content: string }> = []
  if (userText?.trim()) {
    inserts.push({ conversation_id: conversationId, role: 'user', content: userText })
    const title = userText.trim().replace(/\s+/g, ' ').slice(0, 60)
    if (title) {
      await supabase
        .from('conversations').update({ title })
        .eq('id', conversationId).is('title', null)
    }
  }
  if (assistantText?.trim()) {
    inserts.push({ conversation_id: conversationId, role: 'assistant', content: assistantText })
  }
  if (inserts.length > 0) await supabase.from('messages').insert(inserts)
}
