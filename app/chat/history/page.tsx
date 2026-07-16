import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConversationActions } from '@/components/chat/conversation-actions'
import { getSupabaseServerAuthClient } from '@/lib/supabase-auth'

type ConversationRow = {
  id: string
  created_at: string
  title: string | null
}

type MessageRow = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export default async function ChatHistoryPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string }
}) {
  const page = searchParams?.page ?? '1'
  const limit = searchParams?.limit ?? '10'
  const pageNum = Math.max(1, Number(page) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 10))
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1
  const authClient = await getSupabaseServerAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in?next=/chat/history')
  }

  const { data: conversations } = await authClient
    .from('conversations')
    .select('id, created_at, title')
    .order('created_at', { ascending: false })
    .range(from, to)

  const conversationList = (conversations ?? []) as ConversationRow[]
  const conversationIds = conversationList.map((row) => row.id)

  let messagesByConversation = new Map<string, MessageRow[]>()
  if (conversationIds.length > 0) {
    const { data: messages } = await authClient
      .from('messages')
      .select('id, role, content, created_at, conversation_id')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: true })

    messagesByConversation = (messages ?? []).reduce((acc, message) => {
      const current = acc.get(message.conversation_id) ?? []
      current.push({
        id: message.id,
        role: message.role,
        content: message.content,
        created_at: message.created_at,
      })
      acc.set(message.conversation_id, current)
      return acc
    }, new Map<string, MessageRow[]>())
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Your Chat History</h1>
            <Link href="/chat" className="text-sm underline underline-offset-4">
              Open chat
            </Link>
          </div>

          {conversationList.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No conversations yet</CardTitle>
                <CardDescription>Start chatting to build your private history.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            conversationList.map((conversation) => {
              const messages = messagesByConversation.get(conversation.id) ?? []
              const preview = messages[messages.length - 1]?.content ?? 'No messages'

              return (
                <Card key={conversation.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {conversation.title ?? 'Conversation'}
                    </CardTitle>
                    <CardDescription>
                      {new Date(conversation.created_at).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
                    <p className="text-xs text-muted-foreground">
                      {messages.length} message{messages.length === 1 ? '' : 's'}
                    </p>
                    <ConversationActions
                      conversationId={conversation.id}
                      initialTitle={conversation.title}
                      compact
                    />
                    <Link
                      href={`/chat/history/${conversation.id}`}
                      className="text-sm underline underline-offset-4 inline-block"
                    >
                      View transcript
                    </Link>
                  </CardContent>
                </Card>
              )
            })
          )}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/chat/history?page=${Math.max(1, pageNum - 1)}&limit=${pageSize}`}
              className="text-sm underline underline-offset-4"
            >
              Previous
            </Link>
            <Link
              href={`/chat/history?page=${pageNum + 1}&limit=${pageSize}`}
              className="text-sm underline underline-offset-4"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
